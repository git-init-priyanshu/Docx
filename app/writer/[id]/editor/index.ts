"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEditor, type Editor as TiptapEditor } from "@tiptap/react";
import { toast } from "sonner";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { getRandomColor } from "@/helpers/getRandomColor";
import { updateGuestDocument } from "@/lib/guestServices";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import { useDoc } from "@/lib/hooks/useDoc";

import { ydoc, provider, extensions, props } from "./editorConfig";
import { UpdateDocData } from "../actions";

type EditorPropType = {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Editor = ({ setIsSaving }: EditorPropType) => {
  const params = useParams();
  const session = useClientSession();

  const [name, setName] = useState("");

  // session === null → still loading (pass null to defer the fetch)
  // session !== null → resolved: id is set for authenticated users, undefined for guests
  const userId = session === null ? null : session?.id;
  const { doc: docData } = useDoc(params.id as string, userId);

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
  }, []);

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

  const editor = useEditor({
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
  });

  useEffect(() => {
    if (editor) editor.chain().focus().updateUser({ name }).run();
  }, [editor, name]);

  // Hydrate the editor once from the server payload. Re-running this on every
  // `docData` change would wipe whatever the user has just typed (and would
  // also reset Yjs collaboration state).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!editor || !docData || hydratedRef.current) return;
    editor.commands.setContent(docData.data ? JSON.parse(docData.data) : "");
    hydratedRef.current = true;
  }, [editor, docData]);

  return { editor, docData };
};
