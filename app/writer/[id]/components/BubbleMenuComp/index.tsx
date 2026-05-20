import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { toast } from "sonner";

import AskAI from "./AskAI";
import GeneratedText from "./GeneratedText";
import ColorHighlight from "../options/format/ColorHighlight";
import FormattingBtns from "../options/format/FormattingBtns";
import { generateText } from "../../actions";
import { generateTextOptions } from "./generateTextConfig";

type BubbleMenuPropType = {
  editor: Editor | null;
  isHighlighted: boolean;
  bubblePosition: { x: number; y: number };
  generativeTextBubblePosition: { x: number; y: number; width: number };
  onAuthRequired: () => void;
};
export default function BubbleMenuComp({
  editor,
  isHighlighted,
  bubblePosition,
  generativeTextBubblePosition,
  onAuthRequired,
}: BubbleMenuPropType) {
  const [isAiActive, setIsAiActive] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [generativeTextResult, setGenerativeTextResult] = useState("");
  const [lastOption, setLastOption] = useState<generateTextOptions | null>(null);
  const [lastLanguage, setLastLanguage] = useState<string | undefined>(undefined);

  const runGeneration = async (
    option: generateTextOptions,
    language?: string,
  ) => {
    if (!editor) return;

    // Capture the selected text from tiptap, not the DOM. Bubble menu /
    // dropdown interactions can collapse window.getSelection() before we
    // read it.
    const { from, to, empty } = editor.state.selection;
    if (empty) return toast.error("Select some text first");
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    if (!selectedText) return toast.error("Select some text first");

    setLastOption(option);
    setLastLanguage(language);
    setIsAiActive(true);
    setIsGeneratingText(true);
    setGenerativeTextResult("");

    const result = await generateText(option, selectedText, language);
    setIsGeneratingText(false);
    if (!result.success) {
      setIsAiActive(false);
      return toast.error(result.error);
    }
    setGenerativeTextResult(result.data || "");
  };

  const tryAgain = () => {
    if (!lastOption) return;
    runGeneration(lastOption, lastLanguage);
  };

  if (!editor) return;
  return (
    <>
      <div
        className={`min-w-max absolute z-10 ${isHighlighted && !isAiActive ? "flex" : "hidden"}`}
        style={{ left: `${bubblePosition.x}px`, top: `${bubblePosition.y}px` }}
      >
        <div className="flex gap-1 p-2 shadow-md bg-[var(--lp-card)] text-[var(--lp-ink)]">
          <AskAI
            isHighlighted={isHighlighted}
            isAiActive={isAiActive}
            hasPrevious={!!lastOption}
            onGenerate={runGeneration}
            onAuthRequired={onAuthRequired}
          />
          <FormattingBtns editor={editor} isBubbleMenuBtn={true} />
          <ColorHighlight editor={editor} isBubbleMenuBtn={true} />
        </div>
      </div>
      <GeneratedText
        editor={editor}
        isHighlighted={isHighlighted}
        isAiActive={isAiActive}
        setIsAiActive={setIsAiActive}
        isGeneratingText={isGeneratingText}
        generativeTextResult={generativeTextResult}
        setGenerativeTextResult={setGenerativeTextResult}
        onTryAgain={tryAgain}
        position={generativeTextBubblePosition}
      />
    </>
  );
}
