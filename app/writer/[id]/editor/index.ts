"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useEditor } from "@tiptap/react";
import { toast } from "sonner";
import type { Document } from "@prisma/client";
import html2canvas from "html2canvas";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { getRandomColor } from "@/helpers/getRandomColor";
import useDebounce from "@/lib/customHooks/useDebounce";

import { ydoc, provider, extensions, props } from "./editorConfig";
import { GetDocDetails, UpdateDocData, UpdateThumbnail } from "../actions";

type EditorPropType = {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Editor = ({ setIsSaving }: EditorPropType) => {
  const params = useParams();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [docData, setDocData] = useState<Document | undefined>(undefined);
  const [status, setStatus] = useState("connecting");
  // console.log(status);

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setIsFirstLoad(false);
  }, []);

  useEffect(() => {
    // Update status changes
    const statusHandler = (event: any) => {
      setStatus(event.status);
    };

    provider.on("status", statusHandler);

    return () => {
      provider.off("status", statusHandler);
    };
  }, []);

  // Doc data fetching
  useEffect(() => {
    (async () => {
      const response = await GetDocDetails(params.id);
      if (response.success) {
        setDocData(response.data);
      } else {
        toast.error(response.error);
      }
    })();
  }, [params.id]);

  const createDocThumbnail = useCallback(async () => {
    try {
      const page = document.getElementsByClassName("tiptap")[0];
      if (!page) return;
      // @ts-ignore
      const canvas = await html2canvas(page, { scale: 1 });

      const thumbnail = canvas
        .toDataURL(`${docData?.id}thumbnail/png`)
        .replace(/^data:image\/\w+;base64,/, "");

      await UpdateThumbnail(params.id, thumbnail);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  }, [docData?.id, params.id]);

  const debounce = useDebounce(async (editor: any) => {
    setIsSaving(true);

    const response = await UpdateDocData(
      params.id,
      JSON.stringify(editor.getJSON()),
    );
    if (response.success) {
      setIsSaving(false);
      return createDocThumbnail();
    }
    setIsSaving(false);
    toast.error(response.error);
  }, 1000);

  // Editor instance
  const editor = useEditor({
    onCreate: ({ editor: currentEditor }) => {
      provider.on("synced", () => {
        if (currentEditor.isEmpty) {
          currentEditor.commands.setContent("");
        }
      });
    },
    extensions: [
      ...extensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name,
          color: getRandomColor(),
        },
      }),
    ],
    editorProps: props,
    content: "",
    onUpdate({ editor }) {
      if (!isFirstLoad) {
        debounce(editor);
      }
    },
  });

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor) {
      editor.chain().focus().updateUser({ name }).run();
    }
  }, [editor, name]);

  // Set content of the doc
  useEffect(() => {
    if (editor && docData) {
      editor.commands.setContent(
        docData?.data ? JSON.parse(docData?.data) : "",
      );
    }
  }, [editor, docData, docData?.data]);

  return { editor, docData };
};
