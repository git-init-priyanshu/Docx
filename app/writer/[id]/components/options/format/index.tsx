import type { Editor } from "@tiptap/react";

import Heading from "./Heading";
import Font from "./Font";
import FormattingBtns from "./FormattingBtns";
import ColorHighlight from "./ColorHighlight";
import ParagraphBtns from "./ParagraphBtns";
import BulletListBtns from "./BulletListBtns";
import GoBack from "../GoBack";

export default function FormatOptions({ editor }: { editor: Editor | null }) {
  return (
    <div
      className="w-fit hidden flex-col items-start gap-8 lg:flex"
      x-chunk="dashboard-03-chunk-0"
    >
      <GoBack />
      <form className="grid w-full items-start gap-6">
        <fieldset className=" grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Style</legend>
          <div className="grid gap-3">
            <Heading editor={editor} />
          </div>
        </fieldset>
        <fieldset className="grid max-w-fit gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Font</legend>
          <div>
            <Font editor={editor} />
            <div className="w-full mt-3 flex justify-between gap-4">
              <FormattingBtns editor={editor} isBubbleMenuBtn={false} />
              <ColorHighlight editor={editor} isBubbleMenuBtn={false} />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Paragraph</legend>
          <div className="flex gap-4">
            <ParagraphBtns editor={editor} />
            <BulletListBtns editor={editor} />
          </div>
        </fieldset>
      </form>
    </div>
  );
}
