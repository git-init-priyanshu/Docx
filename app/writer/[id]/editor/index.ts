"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useEditor } from "@tiptap/react";
import { toast } from "sonner";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { getRandomColor } from "@/helpers/getRandomColor";
import { updateGuestDocument } from "@/lib/guestServices";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import { useDoc, invalidateDoc } from "@/lib/hooks/useDoc";

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

  const debounce = useDebounce(async (editor: any) => {
    setIsSaving(true);

    if (session?.id) {
      const response = await UpdateDocData(
        params.id as string,
        JSON.stringify(editor.getJSON()),
      );
      if (response.success) {
        invalidateDoc(params.id as string);
        setIsSaving(false);
      } else {
        setIsSaving(false);
        toast.error(response.error);
      }
    } else {
      updateGuestDocument(params.id as string, "data", JSON.stringify(editor.getJSON()));
      setIsSaving(false);
    }
  }, 1000);

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

  useEffect(() => {
    if (editor && docData) {
      editor.commands.setContent(docData.data ? JSON.parse(docData.data) : "");
    }
  }, [editor, docData, docData?.data]);

  return { editor, docData };
};
