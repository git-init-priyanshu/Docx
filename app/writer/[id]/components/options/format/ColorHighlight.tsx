"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { Baseline, ChevronDown, Highlighter } from "lucide-react";
import { HexColorPicker } from "react-colorful";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

type ColorHighlightPropType = {
  editor: Editor | null;
  isBubbleMenuBtn: boolean
}
export default function ColorHighlight({ editor, isBubbleMenuBtn }: ColorHighlightPropType) {
  const colorPopoverRef = useRef<HTMLDivElement>(null);
  const bgPopoverRef = useRef<HTMLDivElement>(null);

  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);
  const [isBgPopoverOpen, setIsBgPopoverOpen] = useState(false);
  const [fontColor, setFontColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#fdfb7a");

  const onFontColorChange = (hex: string) => {
    if (!editor) return;
    setFontColor(hex);
    editor.chain().focus().setColor(hex).run();
  };
  const onHighlightColorChange = (hex: string) => {
    if (!editor) return;
    setHighlightColor(hex);
    editor.chain().focus().toggleHighlight({ color: hex }).run();
  };

  const handleDocumentClick = (e: any) => {
    if (
      (colorPopoverRef.current &&
        !colorPopoverRef.current.contains(e.target))||
      (bgPopoverRef.current &&
        !bgPopoverRef.current.contains(e.target))
    ) {
      setIsColorPopoverOpen(false);
      setIsBgPopoverOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <div className={`flex items-center cursor-pointer rounded w-fit ${isBubbleMenuBtn ? "gap-1" : "border col-span-6 sm:col-span-4 lg:mb-0"}`}>
      <Baseline
        size={35}
        color={fontColor}
        onClick={() => editor?.chain().focus().setColor(fontColor).run()}
        className={`hover:bg-slate-100 p-2 rounded ${isBubbleMenuBtn ? "" : "border-r"}`}
      />
      <Popover open={isColorPopoverOpen}>
        <PopoverTrigger
          className={`py-2 hover:bg-slate-100 ${isBubbleMenuBtn ? "" : "border-r"}`}
          onClick={() => setIsColorPopoverOpen(!isColorPopoverOpen)}
        >
          <ChevronDown size={15} />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          avoidCollisions
          collisionPadding={{ left: 30 }}
        >
          <div ref={colorPopoverRef}>
            <Input
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="mb-4"
            />
            <HexColorPicker
              color={fontColor}
              onChange={onFontColorChange}
              className="mx-auto"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Highlighter
        size={35}
        color={highlightColor}
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .toggleHighlight({ color: highlightColor })
            .run()
        }
        className={`hover:bg-slate-100 p-2 rounded ${isBubbleMenuBtn ? "" : "border-r"}`}
      />
      <Popover open={isBgPopoverOpen}>
        <PopoverTrigger
          className="py-2 hover:bg-slate-100"
          onClick={() => setIsBgPopoverOpen(!isBgPopoverOpen)}
        >
          <ChevronDown size={15} />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          avoidCollisions
          collisionPadding={{ left: 30 }}
        >
          <div ref={bgPopoverRef}>
            <Input
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="mb-4"
            />
            <HexColorPicker
              color={highlightColor}
              onChange={onHighlightColorChange}
              className="mx-auto"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
