"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import { toast } from "sonner";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { getRandomColor } from "@/helpers/getRandomColor";
import { updateGuestDocument } from "@/lib/guestServices";
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
  const { doc: docData } = useDoc(docId, userId);

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
  }, []);

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

  const editor = useEditor(
    {
      onCreate: ({ editor: currentEditor }) => {
        provider.on("sync", () => {
          if (currentEditor.isEmpty) {
            currentEditor.commands.setContent("");
          }
        });
      },
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

  return { editor, docData };
};
