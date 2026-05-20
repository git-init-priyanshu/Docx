"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";

import { generateText } from "../actions";
import { generateTextOptions, LANGUAGES } from "./BubbleMenuComp/generateTextConfig";

type Suggestion = { label: string; option: generateTextOptions };

const SUGGESTIONS: Suggestion[] = [
  { label: "Improve writing", option: generateTextOptions.IMPROVE_WRITING },
  { label: "Continue writing in the author's voice", option: generateTextOptions.CONTINUE_WRITING },
  { label: "Summarise the document", option: generateTextOptions.SUMMARIZE },
  { label: "Fix grammar and spelling", option: generateTextOptions.FIX_SPELLINGS_AND_GRAMMAR },
  { label: "Translate to another language", option: generateTextOptions.TRANSLATE },
];

type Phase = "idle" | "translate" | "generating" | "result";

type AskPaletteProps = {
  open: boolean;
  onClose: () => void;
  editor: Editor | null;
  initialOption?: generateTextOptions;
};

export default function AskPalette({ open, onClose, editor, initialOption }: AskPaletteProps) {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState("");
  const [lastOption, setLastOption] = useState<generateTextOptions | null>(null);
  const [lastLanguage, setLastLanguage] = useState<string | undefined>(undefined);
  const [lastCustom, setLastCustom] = useState<string | undefined>(undefined);
  // True when generation should replace the active selection on accept;
  // otherwise the result is inserted at the caret.
  const [acceptReplacesSelection, setAcceptReplacesSelection] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reject anything that isn't a real enum value — callers occasionally
      // pass through DOM events by mistake (`onClick={openAsk}`), which would
      // otherwise crash the server action serializer.
      const validOption =
        typeof initialOption === "string" &&
        (Object.values(generateTextOptions) as string[]).includes(initialOption)
          ? initialOption
          : undefined;

      if (validOption === generateTextOptions.TRANSLATE) {
        setPhase("translate");
      } else if (validOption) {
        setPhase("idle");
        setTimeout(() => runGeneration(validOption), 0);
      } else {
        setPhase("idle");
      }
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    setQuery("");
    setResult("");
    setPhase("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialOption]);

  if (!open) return null;

  const getInputText = () => {
    if (!editor) return { text: "", replaces: false };
    const { from, to, empty } = editor.state.selection;
    if (!empty) {
      const selected = editor.state.doc.textBetween(from, to, " ").trim();
      if (selected) return { text: selected, replaces: true };
    }
    return { text: editor.getText().trim(), replaces: false };
  };

  const runGeneration = async (
    option: generateTextOptions,
    language?: string,
    customInstruction?: string,
  ) => {
    if (!editor) return;
    const { text, replaces } = getInputText();
    if (!text) {
      toast.error("This document is empty");
      return;
    }
    setAcceptReplacesSelection(replaces);
    setLastOption(option);
    setLastLanguage(language);
    setLastCustom(customInstruction);
    setPhase("generating");
    const res = await generateText(option, text, language, customInstruction);
    if (!res.success) {
      toast.error(res.error);
      setPhase("idle");
      return;
    }
    setResult(res.data || "");
    setPhase("result");
  };

  const handleSuggestionClick = (s: Suggestion) => {
    if (s.option === generateTextOptions.TRANSLATE) {
      setPhase("translate");
    } else {
      runGeneration(s.option);
    }
  };

  const handleSubmit = () => {
    const q = query.trim();
    if (!q) return;
    runGeneration(generateTextOptions.CUSTOM, undefined, q);
  };

  const handleAccept = () => {
    if (!editor || !result) return;
    if (acceptReplacesSelection) {
      // insertContent replaces the current selection if non-empty.
      editor.chain().focus().insertContent(result).run();
    } else {
      // No selection — append to the end so we don't clobber wherever the
      // caret happens to be.
      editor
        .chain()
        .focus("end")
        .insertContent(`\n\n${result}`)
        .run();
    }
    setResult("");
    onClose();
  };

  const handleDiscard = () => {
    setResult("");
    setQuery("");
    setPhase("idle");
  };

  const handleTryAgain = () => {
    if (lastOption) runGeneration(lastOption, lastLanguage, lastCustom);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-32"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/25" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[640px] max-w-[90vw] rounded-xl border overflow-hidden bg-[var(--lp-card)] border-[var(--lp-border)] shadow-2xl"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-[var(--lp-border)]">
          <Sparkles className="w-4 h-4 shrink-0 text-[var(--lp-accent)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="Ask DocX anything about this document…"
            className="flex-1 bg-transparent outline-none text-[14px] text-[var(--lp-ink)] placeholder:text-[var(--lp-muted)]"
            disabled={phase === "generating"}
          />
          <kbd className="font-mono text-[10px] border rounded px-1.5 py-0.5 border-[var(--lp-border)] text-[var(--lp-muted)]">
            esc
          </kbd>
        </div>

        {/* Generating */}
        {phase === "generating" && (
          <div className="flex items-center gap-3 px-4 py-5 text-[var(--lp-muted)]">
            <Sparkles className="w-4 h-4 animate-pulse text-[var(--lp-accent)]" />
            <span className="text-[13.5px]">Generating…</span>
          </div>
        )}

        {/* Result */}
        {phase === "result" && (
          <div className="px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-wider pb-2 text-[var(--lp-muted)]">
              Generated
            </div>
            <p className="text-[13px] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap text-[var(--lp-ink)]">
              {result}
            </p>
            <div className="flex items-center gap-2 border-t mt-3 pt-3 border-[var(--lp-border)]">
              <button
                onClick={handleAccept}
                className="flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-md font-medium transition-opacity hover:opacity-80 bg-[var(--lp-accent)] text-white"
              >
                <Check className="w-3.5 h-3.5" />
                {acceptReplacesSelection ? "Replace selection" : "Insert"}
              </button>
              <button
                onClick={handleDiscard}
                className="flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-md transition-colors hover:bg-[var(--lp-paper-2)] text-[var(--lp-ink)]"
              >
                <X className="w-3.5 h-3.5" />
                Discard
              </button>
              <button
                onClick={handleTryAgain}
                className="flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-md transition-colors hover:bg-[var(--lp-paper-2)] text-[var(--lp-ink)]"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Language picker */}
        {phase === "translate" && (
          <div className="px-2 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 text-[var(--lp-muted)]">
              Choose language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => runGeneration(generateTextOptions.TRANSLATE, lang)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-[13.5px] transition-colors hover:bg-[var(--lp-paper-2)] text-[var(--lp-ink)]"
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {phase === "idle" && (
          <div className="px-2 py-2">
            <div className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 text-[var(--lp-muted)]">
              Suggested
            </div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-[13.5px] transition-colors hover:bg-[var(--lp-paper-2)] text-[var(--lp-ink)]"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[var(--lp-accent)]" />
                <span className="flex-1">{s.label}</span>
                <span className="font-mono text-[10px] text-[var(--lp-muted)]">
                  ↵
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
