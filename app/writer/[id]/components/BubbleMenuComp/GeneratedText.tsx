import type { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { Check, Sparkles, Undo2, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";
import { generateText } from "../../actions";
import { generateTextOptions } from "./generateTextConfig";

type GeneratedTextPropType = {
  editor: Editor | null;
  isHighlighted: boolean;
  isAiActive: boolean;
  setIsAiActive: React.Dispatch<React.SetStateAction<boolean>>;
  isGeneratingText: boolean;
  setIsGeneratingText: React.Dispatch<React.SetStateAction<boolean>>;
  generativeTextResult: string;
  setGenerativeTextResult: React.Dispatch<React.SetStateAction<string>>;
  position: { x: number; y: number; width: number };
};
export default function GeneratedText({
  editor,
  isHighlighted,
  isAiActive,
  setIsAiActive,
  isGeneratingText,
  setIsGeneratingText,
  generativeTextResult,
  setGenerativeTextResult,
  position,
}: GeneratedTextPropType) {
  const getAITextGeneration = async (options: generateTextOptions) => {
    setIsAiActive(true);
    setIsGeneratingText(true);
    const selectedText = window.getSelection();
    if (!selectedText) return setIsGeneratingText(false);

    const result = await generateText(options, selectedText.toString());
    if (!result.success) {
      setIsGeneratingText(false);
      return toast.error(result.error);
    }

    setGenerativeTextResult(result.data || "No result.");
    setIsGeneratingText(false);
  };

  const handleAiResponse = (option: string) => {
    const selection = window.getSelection();
    if (!selection || !editor) return setGenerativeTextResult("");

    switch (option) {
      case "accept":
        editor.chain().focus().insertContent(generativeTextResult).run();
        setGenerativeTextResult("");
        setIsAiActive(false);
        break;
      case "discard":
        setGenerativeTextResult("");
        setIsAiActive(false);
        break;
      case "try_again":
        getAITextGeneration(generateTextOptions.IMPROVE_WRITING);
        break;
      default:
        console.log("Invalid option");
    }
  };
  return (
    <div
      className={`absolute z-10 ${isAiActive ? "block" : "hidden"}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isGeneratingText ? (
        <div className="flex gap-2 p-2 shadow-md bg-neutral-50 items-center">
          <Sparkles size={20} strokeWidth={1} />
          Generating
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            style={{ width: "20px", height: "20px" }}
          >
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="40"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.4"
              ></animate>
            </circle>
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="100"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="-.2"
              ></animate>
            </circle>
            <circle
              fill="#3B82F6"
              stroke="#3B82F6"
              stroke-width="10"
              r="15"
              cx="160"
              cy="100"
            >
              <animate
                attributeName="opacity"
                calcMode="spline"
                dur="2"
                values="1;0;1;"
                keySplines=".5 0 .5 1;.5 0 .5 1"
                repeatCount="indefinite"
                begin="0"
              ></animate>
            </circle>
          </svg>
        </div>
      ) : (
        <DropdownMenu open={isHighlighted && isAiActive}>
          <DropdownMenuTrigger className="flex flex-col max-w-[30rem] text-left gap-2 p-4 shadow-md bg-neutral-50">
            <div className="flex items-center gap-2">
              <Sparkles size={15} color="#737373" strokeWidth={1} />
              <p className="text-sm text-neutral-500">Generated Text</p>
            </div>
            {generativeTextResult}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`bg-neutral-50 w-full mt-2 ${isAiActive ? "block" : "hidden"}`}
          >
            <DropdownMenuItem className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-slate-100 p-1 px-2 cursor-default">
              <Check size={15} />
              <span onClick={() => handleAiResponse("accept")}>Accept</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-slate-100 p-1 px-2 cursor-default">
              <X size={15} />
              <span onClick={() => handleAiResponse("discard")}>Discard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 w-full justify-start items-center rounded-md text-sm hover:bg-slate-100 p-1 px-2 cursor-default">
              <Undo2 size={15} />
              <span onClick={() => handleAiResponse("try_again")}>
                Try again
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
