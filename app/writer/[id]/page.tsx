"use client";

import { useEffect, useState } from "react";
import { EditorContent } from "@tiptap/react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Editor } from "./editor";
import { FormatOptions, InsertOptions } from "./components/options";
import Header from "./components/Header/Header";
import Tabs from "./components/Tabs";
import Loading from "./components/EditorLoading";
import BubbleMenuComp from "./components/BubbleMenuComp";

export default function Dashboard() {
  const [option, setOption] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [position2, setPosition2] = useState({ x: 0, y: 0, width: 0 });

  const { editor, docData } = Editor({ setIsSaving })

  const Options = [
    <FormatOptions key={1} editor={editor} />,
    <InsertOptions key={2} editor={editor} />,
  ];

  // For bubble menu
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection) return;

      setIsHighlighted(selection && selection.toString().length > 0);

      const editorDimensions = document.getElementsByClassName('tiptap')[0].getBoundingClientRect();
      const selectionDimensions = selection.getRangeAt(0).getBoundingClientRect();
      setPosition({
        x: selectionDimensions.left - editorDimensions.left + selectionDimensions.width / 2,
        y: selectionDimensions.top - editorDimensions.top - 60
      })
      setPosition2({
        x: selectionDimensions.left - editorDimensions.left + selectionDimensions.width / 2,
        y: selectionDimensions.top - editorDimensions.top + selectionDimensions.height + 20,
        width: selectionDimensions.width
      })
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [])

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
              <>
                <BubbleMenuComp
                  editor={editor}
                  isHighlighted={isHighlighted}
                  bubblePosition={position}
                  generativeTextBubblePosition={position2}
                />
                <EditorContent editor={editor} />
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
