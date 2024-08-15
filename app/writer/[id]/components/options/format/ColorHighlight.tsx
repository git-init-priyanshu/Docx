'use client'

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Baseline,
  ChevronDown,
  Highlighter,
} from "lucide-react";
import { HexColorPicker } from 'react-colorful';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";

export default function ColorHighlight({ editor }: { editor: Editor | null }) {
  const [fontColor, setFontColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#fdfb7a");

  const onFontColorChange = (hex: string) => {
    if (!editor) return;
    setFontColor(hex)
    editor.chain().focus().setColor(hex).run()
  }
  const onHighlightColorChange = (hex: string) => {
    if (!editor) return;
    setHighlightColor(hex)
    editor.chain().focus().toggleHighlight({ color: hex }).run()
  }

  return (
    <div className="flex cursor-pointer border rounded w-fit col-span-6 sm:col-span-4 lg:mb-0">
      <Baseline
        size={35}
        color={fontColor}
        onClick={() => editor?.chain().focus().setColor(fontColor).run()}
        className="hover:bg-slate-100 p-2 rounded border-r"
      />
      <Popover>
        <PopoverTrigger className="py-2 hover:bg-slate-100 border-r">
          <ChevronDown size={15} />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          avoidCollisions
          collisionPadding={{ left: 30 }}
        >
          <Input
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="mb-4"
          />
          <HexColorPicker color={fontColor} onChange={onFontColorChange} className="mx-auto" />
        </PopoverContent>
      </Popover>
      <Highlighter
        size={35}
        color={highlightColor}
        onClick={() => editor?.chain().focus().toggleHighlight({ color: highlightColor }).run()}
        className="hover:bg-slate-100 p-2 rounded border-r"
      />
      <Popover>
        <PopoverTrigger className="py-2 hover:bg-slate-100">
          <ChevronDown size={15} />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          avoidCollisions
          collisionPadding={{ left: 30 }}
        >
          <Input
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
            className="mb-4"
          />
          <HexColorPicker color={highlightColor} onChange={onHighlightColorChange} className="mx-auto" />
        </PopoverContent>
      </Popover>
    </div>
  )
}
