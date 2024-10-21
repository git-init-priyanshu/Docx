import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

import AskAI from "./AskAI";
import ColorHighlight from "../options/format/ColorHighlight";
import FormattingBtns from "../options/format/FormattingBtns";

export default function BubbleMenuComp({ editor }: { editor: Editor | null }) {
  if (!editor) return;
  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="min-w-max">
      <div className="flex gap-1 p-2 shadow-md bg-neutral-50 ">
        {/* <AskAI /> */}
        <FormattingBtns editor={editor} isBubbleMenuBtn={true} />
        <ColorHighlight editor={editor} isBubbleMenuBtn={true} />
      </div>
    </BubbleMenu>
  )
}
