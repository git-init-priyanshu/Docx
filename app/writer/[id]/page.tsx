"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getRandomColor } from "@/helpers/getRandomColor";
import type { Document } from "@prisma/client";
import useDebounce from "@/lib/customHooks/useDebounce";

import { ydoc, provider, extensions, props } from "./editor/editorConfig";
import { FormatOptions, InsertOptions } from "./components/options";
import { GetDocDetails, UpdateDocData, UpdateThumbnail } from "./actions";
import Header from "./components/Header/Header";
import Tabs from "./components/Tabs";
import Loading from "./components/EditorLoading";

export default function Dashboard() {
  const params = useParams();

  const editorRef = useRef<HTMLDivElement>(null);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [option, setOption] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [docData, setDocData] = useState<Document | undefined>(undefined);
  const [status, setStatus] = useState("connecting");
  // console.log(status);

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setIsFirstLoad(false);
  }, [])

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

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .updateUser({ name })
        .run();
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

  const Options = [
    <FormatOptions key={1} editor={editor} />,
    <InsertOptions key={2} editor={editor} />,
  ];

  return (
    <div className="h-screen overflow-y-hidden w-full">
      <Header editor={editor} name={docData?.name || ""} isSaving={isSaving} />
      <div className="flex h-full">
        <Tabs option={option} setOption={setOption} />
        <div className="w-full flex gap-4 p-4">
          {Options[option]}
          <ScrollArea className="w-full mb-4 flex justify-center">
            {!docData ? (
              <Loading />
            ) : (
              <EditorContent editor={editor} ref={editorRef} />
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
