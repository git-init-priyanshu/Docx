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
import { getGuestUser, updateGuestDocument } from "@/lib/guestServices";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import { useDoc } from "@/lib/hooks/useDoc";

import { extensions, props } from "./editorConfig";
import { UpdateDocData } from "../actions";

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
  const provider = useMemo(
    () =>
      new WebsocketProvider(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL as string,
        `doc.${docId}`,
        ydoc,
      ),
    [docId, ydoc],
  );
  useEffect(() => {
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

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
      if (session?.id) {
        const response = await UpdateDocData(
          params.id as string,
          JSON.stringify(currentEditor.getJSON()),
        );
        if (!response.success) toast.error(response.error);
      } else {
        updateGuestDocument(
          params.id as string,
          "data",
          JSON.stringify(currentEditor.getJSON()),
        );
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
      extensions: [
        ...extensions,
        Collaboration.configure({ document: ydoc }),
        CollaborationCursor.configure({
          provider,
          user: { name, color: getRandomColor() },
        }),
      ],
      editorProps: props,
      content: "",
      onUpdate({ editor }) {
        debounce(editor);
      },
    },
    [docId, ydoc, provider],
  );

  useEffect(() => {
    if (editor) editor.chain().focus().updateUser({ name }).run();
  }, [editor, name]);

  // The ydoc is the single source of truth. We only seed the DB payload into
  // it once the provider has synced (so we know whether the room already holds
  // content) AND the synced ydoc is genuinely empty. A `seeded` flag stored
  // inside the ydoc's shared "meta" map means whichever client first connects
  // to an empty room seeds it; every later client sees non-empty content or
  // `seeded === true` and never re-inserts, so DB content is never appended on
  // top of already-synced Yjs content.
  useEffect(() => {
    if (!editor || !docData) return;

    const meta = ydoc.getMap("meta");
    const seed = () => {
      if (editor.isEmpty && !meta.get("seeded") && docData.data) {
        editor.commands.setContent(JSON.parse(docData.data));
        meta.set("seeded", true);
      }
    };

    if (provider.synced) {
      seed();
    } else {
      provider.on("sync", seed);
    }
    return () => {
      provider.off("sync", seed);
    };
  }, [editor, docData, ydoc, provider]);

  return { editor, docData, error, isLoading };
};
