"use client";

import { Editor } from "@tiptap/react";
import { List, ListOrdered, Quote, Undo, Redo, Sparkles } from "lucide-react";
import { setDefaultStyleValue, onFontStyleChange } from "./options/format/functions";

const HEADING_OPTIONS = [
  { value: "normal", label: "Body" },
  { value: "heading 1", label: "Heading 1" },
  { value: "heading 2", label: "Heading 2" },
  { value: "heading 3", label: "Heading 3" },
  { value: "heading 4", label: "Heading 4" },
  { value: "heading 5", label: "Heading 5" },
  { value: "heading 6", label: "Heading 6" },
];

const Divider = () => (
  <span className="w-px h-5 mx-1 shrink-0" style={{ background: "var(--lp-border)" }} />
);

export default function FormatBar({ editor }: { editor: Editor | null }) {
  const headingValue = setDefaultStyleValue(editor);

  const formatBtns = [
    { label: "B", func: "toggleBold", active: editor?.isActive("bold"), className: "font-bold" },
    { label: "I", func: "toggleItalic", active: editor?.isActive("italic"), className: "italic" },
    { label: "U", func: "toggleUnderline", active: editor?.isActive("underline"), className: "underline decoration-1" },
    { label: "S", func: "toggleStrike", active: editor?.isActive("strike"), className: "line-through" },
  ];

  const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length ?? 0;

  return (
    <div
      className="h-[44px] border-b flex items-center px-3 gap-1 shrink-0 overflow-x-auto"
      style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)" }}
    >
      {/* Undo / Redo */}
      <button
        onClick={() => editor?.commands.undo()}
        title="Undo"
        className="h-8 w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--lp-border)] shrink-0"
        style={{ color: "var(--lp-ink)" }}
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor?.commands.redo()}
        title="Redo"
        className="h-8 w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--lp-border)] shrink-0"
        style={{ color: "var(--lp-ink)" }}
      >
        <Redo className="w-4 h-4" />
      </button>

      <Divider />

      {/* Heading selector */}
      <select
        value={headingValue}
        onChange={(e) => onFontStyleChange(editor, e.target.value)}
        className="h-8 px-2 rounded-md text-[12.5px] bg-transparent border-none outline-none cursor-pointer hover:bg-[var(--lp-border)] shrink-0"
        style={{ color: "var(--lp-ink)" }}
      >
        {HEADING_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <Divider />

      {/* B / I / U / S */}
      {formatBtns.map(({ label, func, active, className }) => (
        <button
          key={label}
          onClick={() => (editor?.chain().focus() as any)?.[func]?.().run()}
          className={`h-8 w-8 rounded-md text-[13px] ${className} transition-colors shrink-0 ${active ? "" : "hover:bg-[var(--lp-border)]"}`}
          style={{
            background: active ? `color-mix(in oklab, var(--lp-accent) 18%, transparent)` : "transparent",
            color: active ? "var(--lp-accent)" : "var(--lp-ink)",
          }}
        >
          {label}
        </button>
      ))}

      <Divider />

      {/* List / Ordered / Quote */}
      <button
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        title="Bullet list"
        className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors shrink-0 ${editor?.isActive("bulletList") ? "" : "hover:bg-[var(--lp-border)]"}`}
        style={{ background: editor?.isActive("bulletList") ? `color-mix(in oklab, var(--lp-accent) 18%, transparent)` : "transparent", color: editor?.isActive("bulletList") ? "var(--lp-accent)" : "var(--lp-ink)" }}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        title="Ordered list"
        className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors shrink-0 ${editor?.isActive("orderedList") ? "" : "hover:bg-[var(--lp-border)]"}`}
        style={{ background: editor?.isActive("orderedList") ? `color-mix(in oklab, var(--lp-accent) 18%, transparent)` : "transparent", color: editor?.isActive("orderedList") ? "var(--lp-accent)" : "var(--lp-ink)" }}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
        className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors shrink-0 ${editor?.isActive("blockquote") ? "" : "hover:bg-[var(--lp-border)]"}`}
        style={{ background: editor?.isActive("blockquote") ? `color-mix(in oklab, var(--lp-accent) 18%, transparent)` : "transparent", color: editor?.isActive("blockquote") ? "var(--lp-accent)" : "var(--lp-ink)" }}
      >
        <Quote className="w-4 h-4" />
      </button>

      <Divider />

      {/* AI Rewrite */}
      <button
        className="h-8 px-2.5 rounded-md flex items-center gap-1.5 text-[12.5px] transition-colors hover:bg-[var(--lp-border)] shrink-0"
        style={{ color: "var(--lp-accent)" }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Rewrite</span>
      </button>

      {/* Word count */}
      <div className="ml-auto flex items-center gap-3 font-mono text-[11px] shrink-0" style={{ color: "var(--lp-muted)" }}>
        <span>{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
