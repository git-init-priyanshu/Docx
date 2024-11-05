import { toast } from "sonner";
import { Check, Languages, Pencil, Sparkles, Wand } from "lucide-react";

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
import { generateText } from "../../actions";
import { generateTextOptions } from "./generateTextConfig";

type AskAIPropType = {
  isHighlighted: boolean,
  isAiActive: boolean,
  setIsAiActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGeneratingText: React.Dispatch<React.SetStateAction<boolean>>;
  setGenerativeTextResult: React.Dispatch<React.SetStateAction<string>>;
};
export default function AskAI({
  isHighlighted,
  isAiActive,
  setIsAiActive,
  setIsGeneratingText,
  setGenerativeTextResult,
}: AskAIPropType) {
  const getAITextGeneration = async (
    options: generateTextOptions,
    language?: string,
  ) => {
    setIsAiActive(true);
    setIsGeneratingText(true);
    const selectedText = window.getSelection();
    if (!selectedText) return setIsGeneratingText(false);

    const result = await generateText(
      options,
      selectedText.toString(),
      language,
    );
    if (!result.success) {
      setIsGeneratingText(false);
      return toast.error(result.error);
    }

    setGenerativeTextResult(result.data || "No result.");
    setIsGeneratingText(false);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            className="flex cursor-pointer bg-neutral-50 rounded gap-1 p-2 w-fit items-center hover:bg-slate-100"
          >
            <Sparkles size={20} />
            Ask AI
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-56 ${isHighlighted && !isAiActive ? "block" : "hidden"}`}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-medium text-neutral-400">
              Suggested
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <Wand />
              <span
                onClick={() =>
                  getAITextGeneration(generateTextOptions.IMPROVE_WRITING)
                }
              >
                Improve writing
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Check />
              <span
                onClick={() =>
                  getAITextGeneration(
                    generateTextOptions.FIX_SPELLINGS_AND_GRAMMAR,
                  )
                }
              >
                Fix spellings & grammar
              </span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages size={15} className="mr-2" />
                <span>Translate</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() =>
                      getAITextGeneration(
                        generateTextOptions.TRANSLATE,
                        "English",
                      )
                    }
                  >
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      getAITextGeneration(
                        generateTextOptions.TRANSLATE,
                        "Hindi",
                      )
                    }
                  >
                    Hindi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      getAITextGeneration(
                        generateTextOptions.TRANSLATE,
                        "Spanish",
                      )
                    }
                  >
                    Spanish
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      getAITextGeneration(
                        generateTextOptions.TRANSLATE,
                        "French",
                      )
                    }
                  >
                    French
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-medium text-neutral-400">
              Edit
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <svg
                role="graphics-symbol"
                viewBox="0 0 16 16"
                style={{
                  width: "16px",
                  height: "16px",
                  display: "block",
                  fill: "black",
                }}
              >
                <path d="M1.56738 3.25879C1.22559 3.25879 0.952148 2.97852 0.952148 2.63672C0.952148 2.29492 1.21875 2.02148 1.56738 2.02148H14.4258C14.7744 2.02148 15.0479 2.29492 15.0479 2.63672C15.0479 2.97852 14.7676 3.25879 14.4258 3.25879H1.56738ZM1.56738 6.84082C1.22559 6.84082 0.952148 6.56055 0.952148 6.21875C0.952148 5.87695 1.21875 5.60352 1.56738 5.60352H14.4258C14.7744 5.60352 15.0479 5.87695 15.0479 6.21875C15.0479 6.56055 14.7676 6.84082 14.4258 6.84082H1.56738ZM1.56738 10.4229C1.22559 10.4229 0.952148 10.1426 0.952148 9.80078C0.952148 9.45898 1.21875 9.18555 1.56738 9.18555H14.4258C14.7744 9.18555 15.0479 9.45898 15.0479 9.80078C15.0479 10.1426 14.7676 10.4229 14.4258 10.4229H1.56738ZM1.56738 14.0049C1.22559 14.0049 0.952148 13.7246 0.952148 13.3828C0.952148 13.041 1.21875 12.7676 1.56738 12.7676H8.75879C9.10742 12.7676 9.38086 13.041 9.38086 13.3828C9.38086 13.7246 9.10059 14.0049 8.75879 14.0049H1.56738Z"></path>
              </svg>
              <span
                onClick={() =>
                  getAITextGeneration(generateTextOptions.MAKE_LONGER)
                }
              >
                Make longer
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <svg
                role="graphics-symbol"
                viewBox="0 0 16 16"
                style={{
                  width: "16px",
                  height: "16px",
                  display: "block",
                  fill: "black",
                }}
              >
                <path d="M1.55371 6.81055C1.21875 6.81055 0.952148 6.54395 0.952148 6.20898C0.952148 5.87402 1.21875 5.60742 1.55371 5.60742H14.4395C14.7744 5.60742 15.0479 5.87402 15.0479 6.20898C15.0479 6.54395 14.7744 6.81055 14.4395 6.81055H1.55371ZM1.55371 10.3926C1.21875 10.3926 0.952148 10.126 0.952148 9.79102C0.952148 9.45605 1.21875 9.18945 1.55371 9.18945H9.2168C9.55176 9.18945 9.81836 9.45605 9.81836 9.79102C9.81836 10.126 9.55176 10.3926 9.2168 10.3926H1.55371Z"></path>
              </svg>
              <span
                onClick={() =>
                  getAITextGeneration(generateTextOptions.MAKE_SHORTER)
                }
              >
                Make shorter
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              <span
                onClick={() =>
                  getAITextGeneration(generateTextOptions.SIMPLIFY_LANGUAGE)
                }
              >
                Simplify language
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
