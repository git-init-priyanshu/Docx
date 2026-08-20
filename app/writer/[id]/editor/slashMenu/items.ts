import type { Editor, Range } from "@tiptap/core";
import {
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table as TableIcon,
  TerminalSquare,
  Type,
  type LucideIcon,
} from "lucide-react";

import { pickImageFiles } from "@/lib/images/pickImageFiles";

export type SlashItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
  /** Extra words that should match the item without appearing in its title. */
  keywords?: string[];
  run: (editor: Editor, range: Range) => void;
};

// Every item deletes the "/query" text before acting, so the trigger never ends
// up inside the block it just created.
const replacing = (editor: Editor, range: Range) =>
  editor.chain().focus().deleteRange(range);

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    Icon: Type,
    keywords: ["paragraph", "body"],
    run: (editor, range) => replacing(editor, range).setNode("paragraph").run(),
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    Icon: Heading1,
    keywords: ["h1", "title"],
    run: (editor, range) =>
      replacing(editor, range).setNode("heading", { level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    Icon: Heading2,
    keywords: ["h2", "subtitle"],
    run: (editor, range) =>
      replacing(editor, range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    Icon: Heading3,
    keywords: ["h3"],
    run: (editor, range) =>
      replacing(editor, range).setNode("heading", { level: 3 }).run(),
  },
  {
    title: "Bulleted list",
    description: "An unordered list",
    Icon: List,
    keywords: ["ul", "bullet", "unordered"],
    run: (editor, range) => replacing(editor, range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "An ordered list",
    Icon: ListOrdered,
    keywords: ["ol", "ordered", "number"],
    run: (editor, range) => replacing(editor, range).toggleOrderedList().run(),
  },
  {
    title: "Quote",
    description: "Set off a passage",
    Icon: Quote,
    keywords: ["blockquote", "citation"],
    run: (editor, range) => replacing(editor, range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    description: "Preformatted code",
    Icon: TerminalSquare,
    keywords: ["snippet", "pre", "monospace"],
    run: (editor, range) => replacing(editor, range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "A horizontal rule",
    Icon: Minus,
    keywords: ["hr", "horizontal", "rule", "separator"],
    run: (editor, range) => replacing(editor, range).setHorizontalRule().run(),
  },
  {
    title: "Table",
    description: "Three columns, with a header row",
    Icon: TableIcon,
    keywords: ["grid", "rows", "columns"],
    run: (editor, range) =>
      replacing(editor, range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: "Image",
    description: "Upload from your device",
    Icon: ImageIcon,
    keywords: ["picture", "photo", "upload", "media"],
    // The file dialog has to open from the click that chose this item, so the
    // range is deleted first and the upload is handed the position it freed.
    run: (editor, range) => {
      replacing(editor, range).run();
      const at = editor.state.selection.from;
      pickImageFiles((files) => editor.commands.insertImageFiles(files, at));
    },
  },
];

export const filterSlashItems = (query: string) => {
  const needle = query.trim().toLowerCase();
  if (!needle) return SLASH_ITEMS;

  return SLASH_ITEMS.filter(({ title, keywords }) =>
    [title, ...(keywords ?? [])].some((term) =>
      term.toLowerCase().includes(needle),
    ),
  );
};
