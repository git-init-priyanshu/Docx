import type { Editor } from "@tiptap/react";

import AskAI from "./AskAI";
import ColorHighlight from "../options/format/ColorHighlight";
import FormattingBtns from "../options/format/FormattingBtns";

type BubbleMenuPropType = {
  editor: Editor | null,
  isHighlighted: boolean,
  bubblePosition: { x: number, y: number }
};
export default function BubbleMenuComp({ editor, isHighlighted, bubblePosition }: BubbleMenuPropType) {
  if (!editor) return;
  return (
    <div
      className={`min-w-max absolute z-10 ${isHighlighted ? "flex" : "hidden"}`}
      style={{ left: `${bubblePosition.x}px`, top: `${bubblePosition.y}px` }}
    >
      <div className="flex gap-1 p-2 shadow-md bg-neutral-50 ">
        <AskAI />
        <FormattingBtns editor={editor} isBubbleMenuBtn={true} />
        <ColorHighlight editor={editor} isBubbleMenuBtn={true} />
      </div>
    </div>
  )
}
