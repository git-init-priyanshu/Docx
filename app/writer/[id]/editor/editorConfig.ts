import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { Color, FontFamily, TextStyle } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";

import { cn } from "@/lib/utils";
import { SlashMenu } from "./slashMenu";

// The editor always shows the full image; the small copy exists only so a
// dashboard thumbnail does not have to download it. `rendered: false` keeps it
// out of the HTML while leaving it in the document JSON, which is what the
// preview is built from.
//
// Width and height do reach the HTML, where they reserve the right amount of
// space before the image loads. They are also what lets a preview draw the
// picture at the size it has in the document rather than an arbitrary one.
const ImageWithThumbnail = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      thumbData: { default: null, rendered: false },
      width: { default: null },
      height: { default: null },
    };
  },
});

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
  ImageWithThumbnail.configure({ inline: true, allowBase64: true }),
  SlashMenu,
  Placeholder.configure({
    // An empty document says what it is; an empty block says what to do with
    // it. Showing the second on every blank line would put "Type / for
    // commands" beside every paragraph the user is midway through writing.
    placeholder: ({ node, editor }) =>
      editor.isEmpty && node.type.name === "paragraph"
        ? "Write something, or press / for commands"
        : node.type.name === "heading"
          ? "Heading"
          : "Press / for commands",
    showOnlyCurrent: true,
  }),
];

// A writing surface rather than a sheet of paper: the card, shadow and cream
// backdrop stay, but the height follows the content instead of being pinned to
// a page that never breaks.
//
// The width is marked important because `prose` sets its own `max-width: 65ch`.
// Both land in the utilities layer, so without it the winner would depend on
// Tailwind's internal sort order rather than on anything written here.
export const props = {
  attributes: {
    class: cn(
      "lp-editor prose [&_ol]:list-decimal [&_ul]:list-disc",
      "w-full !max-w-[860px] min-h-[60vh] mx-auto",
      "bg-[var(--lp-card)] text-[var(--lp-ink)] rounded-lg",
      "px-6 py-10 sm:px-12 sm:py-14 md:px-20 my-6 lp-doc-shadow",
      "focus-visible:outline-none",
    ),
  },
};
