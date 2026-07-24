import type { Editor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";

// Convert a raw AI string into ProseMirror paragraph nodes so multi-paragraph
// output keeps its structure. Blank lines separate paragraphs; single newlines
// become hard breaks within a paragraph.
function toParagraphNodes(raw: string): JSONContent[] {
  return raw
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const content: JSONContent[] = [];
      block.split("\n").forEach((line, i) => {
        if (i > 0) content.push({ type: "hardBreak" });
        if (line) content.push({ type: "text", text: line });
      });
      return { type: "paragraph", content };
    });
}

// Insert an AI result, preserving paragraph and line-break structure.
// When `append` is true the content is added at the end of the document as new
// paragraphs; otherwise it replaces the current selection.
export function insertGeneratedText(
  editor: Editor,
  raw: string,
  { append = false }: { append?: boolean } = {},
) {
  const paragraphs = toParagraphNodes(raw);
  if (paragraphs.length === 0) return;

  if (append) {
    // Leading empty paragraph keeps a blank-line gap from existing content.
    editor
      .chain()
      .focus("end")
      .insertContent([{ type: "paragraph" }, ...paragraphs])
      .run();
  } else {
    editor.chain().focus().insertContent(paragraphs).run();
  }
}
