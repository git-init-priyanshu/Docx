"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEditor } from "@tiptap/react";
import { type Editor as TiptapEditor } from "@tiptap/core";
import { toast } from "sonner";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

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
import { ROOM_TOKEN_TTL_MS, roomForDoc } from "@/lib/room";

import { extensions, props } from "./editorConfig";
import { UpdateDocData } from "../actions";
import { CreateDocVersion } from "../versions/actions";
import { MintRoomToken } from "../collaboration/actions";

// Refresh comfortably before expiry so a reconnect never races the deadline.
const ROOM_TOKEN_REFRESH_MS = ROOM_TOKEN_TTL_MS - 60_000;

type EditorPropType = {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
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

  // Per-document Yjs collaboration. The room is keyed on the docId, not on
  // the calendar date, so accounts editing different documents never sync
  // into each other's content. ydoc + provider are scoped to this docId and
  // torn down on unmount / navigation to a different doc.
  // Lifecycle is keyed on docId — eslint doesn't see that the factory body
  // doesn't reference it because the dependency *is* the identity tag.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ydoc = useMemo(() => new Y.Doc(), [docId]);

  // Guests get a local Y.Doc and no network provider at all. Their documents
  // live in localStorage, so nobody can ever join the room — and once AI
  // requests travel through the room, an unauthenticated room would be a way
  // around the login gate. The Collaboration extension needs a Y.Doc, not a
  // provider, so the editor is otherwise unchanged.
  const provider = useMemo(() => {
    if (!userId) return null;
    return new WebsocketProvider(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL as string,
      roomForDoc(docId),
      ydoc,
      { connect: false },
    );
  }, [docId, ydoc, userId]);

  useEffect(() => {
    return () => {
      provider?.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  // The socket carries a short-lived signed token, so connecting has to wait
  // for the first mint. `provider.url` is a getter over `params`, so refreshing
  // the token in place is picked up by the next reconnect without tearing the
  // provider down — a live socket is never interrupted.
  useEffect(() => {
    if (!provider) return;

    let cancelled = false;

    const refresh = async () => {
      const res = await MintRoomToken(docId);
      if (cancelled) return;
      if (!res.success || !res.data) {
        toast.error(res.error ?? "Could not join the collaboration session");
        return;
      }
      provider.params.token = res.data.token;
      if (!provider.shouldConnect) provider.connect();
    };

    refresh();
    const timer = setInterval(refresh, ROOM_TOKEN_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [provider, docId]);

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
          if (version.success && version.data !== "skipped")
            invalidateVersions(docId);
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

  const editor = useEditor(
    {
      onCreate: ({ editor: currentEditor }) => {
        provider?.on("sync", () => {
          if (currentEditor.isEmpty) {
            currentEditor.commands.setContent("");
          }
        });
      },
      extensions: [
        ...extensions,
        Collaboration.configure({ document: ydoc }),
        // Cursors are a property of the network session; without a provider
        // there are no peers to show one to.
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: { name, color: getRandomColor() },
              }),
            ]
          : []),
      ],
      editorProps: props,
      content: "",
      onUpdate({ editor }) {
        debounce(editor);
      },
    },
    [docId, ydoc, provider],
  );

  // updateUser is registered by CollaborationCursor, which guests don't load.
  // The provider is not a safe proxy for that: useEditor rebuilds the editor
  // asynchronously, so right after the session resolves there is a render where
  // the provider exists but `editor` is still the instance built without the
  // extension. Ask the editor what it actually supports instead.
  useEffect(() => {
    if (!editor) return;
    if (typeof editor.commands.updateUser !== "function") return;
    editor.chain().focus().updateUser({ name }).run();
  }, [editor, name]);

  // Hydrate the editor once per document from the server payload. Tracking by
  // docId rather than a plain boolean lets us re-hydrate when navigating to a
  // different document without wiping in-progress typing on the current one.
  const hydratedDocRef = useRef<string | null>(null);
  useEffect(() => {
    if (!editor || !docData) return;
    if (hydratedDocRef.current === docId) return;
    editor.commands.setContent(docData.data ? JSON.parse(docData.data) : "");
    hydratedDocRef.current = docId;
  }, [editor, docData, docId]);

  return { editor, docData, error, isLoading };
};
