import { Color } from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";

import { cn } from "@/lib/utils";

export const extensions = [
  StarterKit.configure({
    history: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
  }),
  Color.configure({ types: [TextStyle.name] }),
  Highlight.configure({ multicolor: true }),
  // Imported documents carry hyperlinks; without this mark they would arrive
  // as plain text. openOnClick stays off so a click places the caret instead
  // of navigating away mid-edit.
  Link.configure({ openOnClick: false, autolink: false }),
  Underline,
  TextStyle,
  FontFamily,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

export const props = {
  attributes: {
    class: cn(
      "prose [&_ol]:list-decimal [&_ul]:list-disc w-[816.3px] max-w-[816.3px] min-h-[1056.36px] mx-auto bg-[var(--lp-card)] text-[var(--lp-ink)] rounded-md p-24 my-6 lp-doc-shadow focus-visible:outline-none",
    ),
  },
};
