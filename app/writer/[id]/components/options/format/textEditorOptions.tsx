import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";

export const formattingBtns = [
  { Icon: Bold, name: "bold", func: "toggleBold" },
  { Icon: Italic, name: "italic", func: "toggleItalic" },
  { Icon: Underline, name: "underline", func: "toggleUnderline" },
  { Icon: Strikethrough, name: "strike", func: "toggleStrike" },
];
export const paragraphBtns = [
  { Icon: AlignLeft, align: "left" },
  { Icon: AlignCenter, align: "center" },
  { Icon: AlignRight, align: "right" },
  { Icon: AlignJustify, align: "justify" },
];
export const fontFamily = [
  { title: "Inter", font: "Inter" },
  { title: "Comic Sans", font: "Comic Sans MS, Comic Sans" },
  { title: "Serif", font: "serif" },
  { title: "Monospace", font: "monospace" },
  { title: "Cursive", font: "cursive" },
];
