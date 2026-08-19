"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEditor } from "@tiptap/react";
import { type Editor as TiptapEditor } from "@tiptap/core";
import { toast } from "sonner";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";

import { getRandomColor } from "@/helpers/getRandomColor";
import {
  createGuestVersion,
  getGuestUser,
  updateGuestDocument,
} from "@/lib/guestServices";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import { useDoc } from "@/lib/hooks/useDoc";
import { invalidateVersions } from "@/lib/hooks/useVersions";

import { resolveImageSrc } from "@/lib/images/upload";

import { extensions, props } from "./editorConfig";
import { ImageUpload } from "./imageUpload";
import { UpdateDocData } from "../actions";
import { CreateDocVersion } from "../versions/actions";
import { IndexDocument } from "../rag/actions";

type EditorPropType = {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
};

// docId is carried alongside so effects can tell a live session from one that
// belongs to the document we just navigated away from.
type CollabSession = {
  docId: string;
  ydoc: Y.Doc;
  provider: WebsocketProvider;
};

export const Editor = ({ setIsSaving }: EditorPropType) => {
  const params = useParams();
  const docId = params.id as string;
  const session = useClientSession();

  const [name, setName] = useState("");

  // session === null → still loading (pass null to defer the fetch)
  // session !== null → resolved: id is set for authenticated users, undefined for guests
  const userId = session === null ? null : session?.id;
  const { doc: docData, error, isLoading } = useDoc(docId, userId);

  useEffect(() => {
    if (session === null) return;
    setName(session.id ? session.name || "" : getGuestUser().name);
  }, [session]);

  // Per-document Yjs collaboration. The room is keyed on the docId, so
  // accounts editing different documents never sync into each other's content.
  //
  // Creation and teardown must live in the same effect. Building these with
  // useMemo and destroying them from a separate cleanup breaks under React
  // strict mode: the component mounts, unmounts and mounts again, the first
  // cleanup destroys the provider, and useMemo then hands the second mount the
  // same already-destroyed objects. The socket never syncs and the room stays
  // empty for everyone.
  const [collab, setCollab] = useState<CollabSession | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL as string,
      `doc.${docId}`,
      ydoc,
    );
    setCollab({ docId, ydoc, provider });

    return () => {
      provider.destroy();
      ydoc.destroy();
      setCollab(null);
    };
  }, [docId]);

  // Save serialization: never run two persists in parallel. If onUpdate fires
  // again while a save is in flight, we just flip `pendingRef` and re-fire
  // once the current one resolves — using the editor's latest content at that
  // moment. Prevents network reordering from clobbering newer keystrokes.
  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);

  const persist = async (currentEditor: TiptapEditor) => {
    if (inFlightRef.current) {
      pendingRef.current = true;
      return;
    }
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      const data = JSON.stringify(currentEditor.getJSON());

      // Version snapshots ride along with autosave; the throttle that decides
      // whether a save actually becomes a snapshot lives in versions/policy.
      if (session?.id) {
        const response = await UpdateDocData(docId, data);
        if (!response.success) {
          toast.error(response.error);
        } else {
          const version = await CreateDocVersion(docId, data);
          if (version.success && version.data !== "skipped") {
            invalidateVersions(docId);
            // Not awaited: embedding takes seconds and the save is already
            // durable. A dropped call is retried by the next snapshot.
            IndexDocument(docId).catch(() => {});
          }
        }
      } else {
        updateGuestDocument(docId, "data", data);
        if (createGuestVersion(docId, data)) invalidateVersions(docId);
      }
    } finally {
      inFlightRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        persist(currentEditor);
      } else {
        setIsSaving(false);
      }
    }
  };

  const debounce = useDebounce(persist, 1000);

  // Flush any pending debounced save if the user closes the tab before the
  // 1s delay fires, so the last edit isn't lost.
  useEffect(() => {
    const flush = () => debounce.flush();
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      debounce.flush();
    };
  }, [debounce]);

  // The Yjs room, not the database row, is the live state once anyone is
  // connected. Seeding has to wait for sync to finish, or we cannot tell an
  // empty room from one whose content simply has not arrived yet.
  const [isSynced, setIsSynced] = useState(false);
  useEffect(() => {
    if (!collab) {
      setIsSynced(false);
      return;
    }
    // Read the current value rather than assuming false: against a fast server
    // the provider can finish syncing before React commits this effect, and the
    // event would already have fired with nobody listening.
    setIsSynced(collab.provider.synced);
    const onSync = (synced: boolean) => setIsSynced(synced);
    collab.provider.on("sync", onSync);
    return () => {
      collab.provider.off("sync", onSync);
    };
  }, [collab]);

  // useEditor is not rebuilt when the session resolves, so the upload path
  // reads the current value instead of closing over whatever it was when the
  // editor was built — otherwise signing in mid-visit still writes data URIs.
  const isSignedInRef = useRef(false);
  isSignedInRef.current = Boolean(session?.id);

  const editor = useEditor(
    {
      extensions: [
        ...extensions,
        ImageUpload.configure({
          upload: (file) => resolveImageSrc(file, docId, isSignedInRef.current),
          onError: (message) => toast.error(message),
        }),
        ...(collab
          ? [
              Collaboration.configure({ document: collab.ydoc }),
              CollaborationCaret.configure({
                provider: collab.provider,
                user: { name, color: getRandomColor() },
              }),
            ]
          : []),
      ],
      editorProps: props,
      // Next renders this on the server first, and rendering the editor during
      // that pass would mismatch the client's tree on hydration.
      immediatelyRender: false,
      // No `content` here on purpose. With Collaboration the editor's initial
      // content is written into the shared Y.Doc, so every client that mounts
      // would apply its own copy. Content comes from the room, or from the
      // one-time seed below when the room is empty.
      onUpdate({ editor }) {
        debounce(editor);
      },
    },
    [docId, collab],
  );

  useEffect(() => {
    // updateUser comes from CollaborationCaret. useEditor rebuilds the editor
    // one commit after the collaboration session appears, so there is a render
    // where collab exists but this editor was still built without the caret
    // extension — test for the command rather than for the session.
    if (!editor || typeof editor.commands.updateUser !== "function") return;
    editor.chain().focus().updateUser({ name }).run();
  }, [editor, collab, name]);

  // Seed the room from the database only when it is genuinely empty. With the
  // Collaboration extension, setContent is a Yjs transaction rather than a
  // local assignment: running it against a room that already holds content
  // appends the stored copy on top of the live one, and every peer that does
  // it broadcasts another copy. That is the same bug in both directions —
  // duplicated text, and a peer's stale database payload overwriting edits
  // that another peer just made.
  //
  // Tracking by docId rather than a plain boolean lets us seed again when
  // navigating to a different document without wiping the current one.
  const hydratedDocRef = useRef<string | null>(null);
  useEffect(() => {
    if (!editor || !docData || !isSynced) return;
    if (!collab || collab.docId !== docId) return;
    if (hydratedDocRef.current === docId) return;
    hydratedDocRef.current = docId;

    if (collab.ydoc.getXmlFragment("default").length > 0) return;
    if (!docData.data) return;

    editor.commands.setContent(JSON.parse(docData.data));
  }, [editor, docData, docId, isSynced, collab]);

  return { editor, docData, error, isLoading };
};
