"use client";

import { useEffect, useState } from "react";
import { EditorContent } from "@tiptap/react";

import { Editor } from "./editor";
import Toolbar from "./components/Header/Header";
import LeftSidebar from "./components/Tabs";
import FormatBar from "./components/FormatBar";
import RightRail from "./components/RightRail";
import AskPalette from "./components/AskPalette";
import Loading from "./components/EditorLoading";
import BubbleMenuComp from "./components/BubbleMenuComp";

export default function WriterPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [position2, setPosition2] = useState({ x: 0, y: 0, width: 0 });
  const [askOpen, setAskOpen] = useState(false);

  const { editor, docData } = Editor({ setIsSaving });

  // ⌘K / Ctrl+K to open the Ask palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAskOpen((o) => !o);
      }
      if (e.key === "Escape") setAskOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Bubble menu selection tracking
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection) return;

      setIsHighlighted(selection.toString().length > 0);

      const editorEl = document.getElementsByClassName("tiptap")[0];
      if (!editorEl || !selection.rangeCount) return;

      const editorRect = editorEl.getBoundingClientRect();
      const selectionRect = selection.getRangeAt(0).getBoundingClientRect();

      setPosition({
        x: selectionRect.left - editorRect.left + selectionRect.width / 2,
        y: selectionRect.top - editorRect.top - 60,
      });
      setPosition2({
        x: selectionRect.left - editorRect.left + selectionRect.width / 2,
        y: selectionRect.top - editorRect.top + selectionRect.height + 20,
        width: selectionRect.width,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  return (
    <div
      className="h-screen w-screen flex overflow-hidden"
      style={{ background: "var(--lp-paper)" }}
    >
      {/* Left sidebar */}
      <LeftSidebar name={docData?.name} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <Toolbar
          name={docData?.name || ""}
          isSaving={isSaving}
          onAsk={() => setAskOpen(true)}
        />

        {/* Format bar */}
        <FormatBar editor={editor} />

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto" style={{ background: "var(--lp-paper-2)" }}>
          <div className="relative pb-16">
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
          </div>
        </div>
      </main>

      {/* Right rail */}
      <RightRail />

      {/* ⌘K palette */}
      <AskPalette open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
