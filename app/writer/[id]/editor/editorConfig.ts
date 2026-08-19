import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { Color, FontFamily, TextStyle } from "@tiptap/extension-text-style";

import { cn } from "@/lib/utils";

export const extensions = [
  StarterKit.configure({
    // Undo/redo is Yjs's job once Collaboration is attached; the local history
    // plugin would fight it over the same transactions.
    undoRedo: false,
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    // Imported documents carry hyperlinks; without this mark they would arrive
    // as plain text. openOnClick stays off so a click places the caret instead
    // of navigating away mid-edit.
    link: { openOnClick: false, autolink: false },
  }),
  Color.configure({ types: [TextStyle.name] }),
  Highlight.configure({ multicolor: true }),
  TextStyle,
  FontFamily,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  // Column widths are stored as a colwidth attr on each cell, so a drag is an
  // ordinary document change and reaches collaborators through Yjs like any
  // other edit.
  TableKit.configure({ table: { resizable: true } }),
  // `inline` matches how Google Docs models images — as content within a
  // paragraph — which keeps the importer a straight element-for-element map.
  //
  // `allowBase64` is what lets a guest's image survive: with no session there
  // is no upload token, so their images are data URIs, and the extension
  // strips those on parse otherwise.
  Image.configure({ inline: true, allowBase64: true }),
];

export const props = {
  attributes: {
    class: cn(
      "prose [&_ol]:list-decimal [&_ul]:list-disc w-[816.3px] max-w-[816.3px] min-h-[1056.36px] mx-auto bg-[var(--lp-card)] text-[var(--lp-ink)] rounded-md p-24 my-6 lp-doc-shadow focus-visible:outline-none",
    ),
  },
};
