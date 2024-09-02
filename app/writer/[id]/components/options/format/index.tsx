import { Editor } from "@tiptap/react";

import Heading from "./Heading";
import Font from "./Font";
import FormattingBtns from "./FormattingBtns";
import ColorHighlight from "./ColorHighlight";
import ParagraphBtns from "./ParagraphBtns";

export default function FormatOptions({ editor }: { editor: Editor | null }) {
  return (
    <div
      className="w-fit hidden flex-col items-start gap-8 lg:flex"
      x-chunk="dashboard-03-chunk-0"
    >
      <form className="grid w-full items-start gap-6">
        <fieldset className=" grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Style</legend>
          <div className="grid gap-3">
            <Heading editor={editor} />
          </div>
        </fieldset>
        <fieldset className="grid max-w-fit gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Font</legend>
          <div className="">
            <Font editor={editor} />
            <div className="w-full mt-3 flex justify-between gap-4">
              <FormattingBtns editor={editor} />
              <ColorHighlight editor={editor} />
            </div>
          </div>
        </fieldset>
        <fieldset className="grid gap-6 bg-white rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Paragraph</legend>
          <div className="grid gap-3">
            <ParagraphBtns editor={editor} />
          </div>
        </fieldset>
      </form>
    </div>
  );
}
