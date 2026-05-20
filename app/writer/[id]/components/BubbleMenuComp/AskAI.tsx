"use client";

import {
  Check,
  Languages,
  Pencil,
  Sparkles,
  Wand,
  FileDigit,
  StretchHorizontal,
  Minimize2,
  Undo2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import useClientSession from "@/lib/customHooks/useClientSession";
import { generateTextOptions, LANGUAGES } from "./generateTextConfig";

type AskAIPropType = {
  isHighlighted: boolean;
  isAiActive: boolean;
  hasPrevious: boolean;
  onGenerate: (option: generateTextOptions, language?: string) => void;
  onAuthRequired: () => void;
};

export default function AskAI({
  isHighlighted,
  isAiActive,
  hasPrevious,
  onGenerate,
  onAuthRequired,
}: AskAIPropType) {
  const session = useClientSession();

  const handle = (option: generateTextOptions, language?: string) => {
    if (session !== null && !session.id) {
      onAuthRequired();
      return;
    }
    onGenerate(option, language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer bg-[var(--lp-card)] text-[var(--lp-ink)] rounded gap-1 p-2 w-fit items-center hover:bg-[var(--lp-paper-2)]"
        >
          <Sparkles size={16} />
          Ask AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 bg-[var(--lp-card)] text-[var(--lp-ink)] ${isHighlighted && !isAiActive ? "block" : "hidden"}`}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium text-[var(--lp-muted)]">
            Suggested
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.IMPROVE_WRITING)}
          >
            <Wand size={15} className="mr-2" />
            Improve writing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.FIX_SPELLINGS_AND_GRAMMAR)}
          >
            <Check size={15} className="mr-2" />
            Fix spellings & grammar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.SUMMARIZE)}
          >
            <FileDigit size={15} className="mr-2" />
            Summarize
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages size={15} className="mr-2" />
              <span>Translate</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-[var(--lp-card)] text-[var(--lp-ink)]">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() =>
                      handle(generateTextOptions.TRANSLATE, lang)
                    }
                  >
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium text-[var(--lp-muted)]">
            Edit
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.MAKE_LONGER)}
          >
            <StretchHorizontal size={15} className="mr-2" />
            Make longer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.MAKE_SHORTER)}
          >
            <Minimize2 size={15} className="mr-2" />
            Make shorter
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handle(generateTextOptions.SIMPLIFY_LANGUAGE)}
          >
            <Pencil size={15} className="mr-2" />
            Simplify language
          </DropdownMenuItem>
          {hasPrevious && (
            <DropdownMenuItem
              onClick={() => handle(generateTextOptions.TRY_AGAIN)}
            >
              <Undo2 size={15} className="mr-2" />
              Try again
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
