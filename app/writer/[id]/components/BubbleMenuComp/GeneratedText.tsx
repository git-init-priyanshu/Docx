import type { Editor } from "@tiptap/react";
import { Check, Sparkles, Undo2, X } from "lucide-react";

import { insertGeneratedText } from "../../editor/insertGeneratedText";

type GeneratedTextPropType = {
  editor: Editor | null;
  setIsAiActive: React.Dispatch<React.SetStateAction<boolean>>;
  isGeneratingText: boolean;
  generativeTextResult: string;
  setGenerativeTextResult: React.Dispatch<React.SetStateAction<string>>;
  onTryAgain: () => void;
};

const ACTION_CLASS =
  "flex items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] text-[var(--lp-ink)] transition-colors hover:bg-[var(--lp-paper-2)]";

export default function GeneratedText({
  editor,
  setIsAiActive,
  isGeneratingText,
  generativeTextResult,
  setGenerativeTextResult,
  onTryAgain,
}: GeneratedTextPropType) {
  const handleAccept = () => {
    if (!editor || !generativeTextResult) return;
    insertGeneratedText(editor, generativeTextResult);
    setGenerativeTextResult("");
    setIsAiActive(false);
  };

  const handleDiscard = () => {
    setGenerativeTextResult("");
    setIsAiActive(false);
  };

  if (isGeneratingText) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] px-3 py-2 text-[var(--lp-ink)] shadow-lg">
        <Sparkles size={15} className="animate-pulse text-[var(--lp-accent)]" />
        <span className="text-[13px] text-[var(--lp-muted)]">Generating…</span>
      </div>
    );
  }

  return (
    <div className="flex w-[min(30rem,90vw)] flex-col rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)] shadow-lg">
      <div className="flex items-center gap-2 border-b border-[var(--lp-border)] px-3 py-2">
        <Sparkles size={14} className="text-[var(--lp-accent)]" strokeWidth={1.5} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--lp-muted)]">
          Generated
        </span>
      </div>

      <p className="max-h-64 overflow-y-auto whitespace-pre-wrap px-3 py-2.5 text-[13px] leading-relaxed">
        {generativeTextResult}
      </p>

      <div className="flex items-center gap-1 border-t border-[var(--lp-border)] px-2 py-1.5">
        <button onClick={handleAccept} className={ACTION_CLASS}>
          <Check size={14} />
          Accept
        </button>
        <button onClick={onTryAgain} className={ACTION_CLASS}>
          <Undo2 size={14} />
          Try again
        </button>
        <button
          onClick={handleDiscard}
          className={`${ACTION_CLASS} ml-auto text-[var(--lp-muted)]`}
        >
          <X size={14} />
          Discard
        </button>
      </div>
    </div>
  );
}
