"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Tighten the opening paragraph",
  "Continue writing in the author's voice",
  "Summarise the document",
  "Fix grammar and spelling",
  "Translate to another language",
];

type AskPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export default function AskPalette({ open, onClose }: AskPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      setQuery("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.25)" }} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[640px] max-w-[90vw] rounded-xl border overflow-hidden"
        style={{
          background: "var(--lp-card)",
          borderColor: "var(--lp-border)",
          boxShadow: "0 30px 60px -25px rgba(20,17,13,.18), 0 8px 20px -10px rgba(20,17,13,.10)",
        }}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 h-12 border-b" style={{ borderColor: "var(--lp-border)" }}>
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: "var(--lp-accent)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask DocX anything about this document…"
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{ color: "var(--lp-ink)" }}
          />
          <kbd
            className="font-mono text-[10px] border rounded px-1.5 py-0.5"
            style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}
          >
            esc
          </kbd>
        </div>

        {/* Suggestions */}
        <div className="px-2 py-2">
          <div
            className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5"
            style={{ color: "var(--lp-muted)" }}
          >
            Suggested
          </div>
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-[13.5px] transition-colors hover:bg-[var(--lp-paper-2)]"
              style={{ color: "var(--lp-ink)" }}
            >
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: "var(--lp-accent)" }} />
              <span className="flex-1">{text}</span>
              <span className="font-mono text-[10px]" style={{ color: "var(--lp-muted)" }}>↵</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
