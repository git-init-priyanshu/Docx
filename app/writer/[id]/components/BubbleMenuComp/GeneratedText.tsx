import type { Editor } from "@tiptap/react";
import { Check, Sparkles, Undo2, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";

type GeneratedTextPropType = {
  editor: Editor | null;
  isHighlighted: boolean;
  isAiActive: boolean;
  setIsAiActive: React.Dispatch<React.SetStateAction<boolean>>;
  isGeneratingText: boolean;
  generativeTextResult: string;
  setGenerativeTextResult: React.Dispatch<React.SetStateAction<string>>;
  onTryAgain: () => void;
  position: { x: number; y: number; width: number };
};
export default function GeneratedText({
  editor,
  isHighlighted,
  isAiActive,
  setIsAiActive,
  isGeneratingText,
  generativeTextResult,
  setGenerativeTextResult,
  onTryAgain,
  position,
}: GeneratedTextPropType) {
  const handleAccept = () => {
    if (!editor || !generativeTextResult) return;
    editor.chain().focus().insertContent(generativeTextResult).run();
    setGenerativeTextResult("");
    setIsAiActive(false);
  };

  const handleDiscard = () => {
    setGenerativeTextResult("");
    setIsAiActive(false);
  };

  return (
    <div
      className={`absolute z-10 ${isAiActive ? "block" : "hidden"}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isGeneratingText ? (
        <div className="flex gap-2 p-2 shadow-md bg-[var(--lp-card)] text-[var(--lp-ink)] items-center rounded">
          <Sparkles size={16} className="animate-pulse text-[var(--lp-accent)]" />
          <span className="text-sm">Generating…</span>
        </div>
      ) : (
        <DropdownMenu open={isHighlighted && isAiActive}>
          <DropdownMenuTrigger className="flex flex-col max-w-[30rem] text-left gap-2 p-4 shadow-md bg-[var(--lp-card)] text-[var(--lp-ink)] rounded">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--lp-accent)]" strokeWidth={1.5} />
              <p className="text-sm text-[var(--lp-muted)]">Generated text</p>
            </div>
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
              {generativeTextResult}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`bg-[var(--lp-card)] w-full mt-2 ${isAiActive ? "block" : "hidden"}`}
          >
            <DropdownMenuItem
              onClick={handleAccept}
              className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-[var(--lp-paper-2)] p-1 px-2 cursor-pointer"
            >
              <Check size={15} />
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDiscard}
              className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-[var(--lp-paper-2)] p-1 px-2 cursor-pointer"
            >
              <X size={15} />
              Discard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onTryAgain}
              className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-[var(--lp-paper-2)] p-1 px-2 cursor-pointer"
            >
              <Undo2 size={15} />
              Try again
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
