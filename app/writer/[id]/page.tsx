"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Editor } from "./editor";
import { FormatOptions, InsertOptions } from "./components/options";
import Header from "./components/Header/Header";
import Tabs from "./components/Tabs";
import Loading from "./components/EditorLoading";

export default function Dashboard() {
  const [option, setOption] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const { editor, docData } = Editor({ setIsSaving })

  const asdf = 1;

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
              <EditorContent editor={editor} />
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
