import { useState } from "react";
import type { Editor } from "@tiptap/react";

import AskAI from "./AskAI";
import GeneratedText from "./GeneratedText";
import ColorHighlight from "../options/format/ColorHighlight";
import FormattingBtns from "../options/format/FormattingBtns";

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
            setIsAiActive={setIsAiActive}
            setIsGeneratingText={setIsGeneratingText}
            setGenerativeTextResult={setGenerativeTextResult}
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
        setIsGeneratingText={setIsGeneratingText}
        generativeTextResult={generativeTextResult}
        setGenerativeTextResult={setGenerativeTextResult}
        position={generativeTextBubblePosition}
      />
    </>
  );
}
