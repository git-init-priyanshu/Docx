// Tiptap-JSON → Markdown / plain-text converters. Walks the stored document
// JSON (same node shape used by components/DocThumbnail.tsx) and renders clean
// output. Pure functions — safe to run client-side for guests and signed-in
// users alike.
//
// `renderBlock` and the node types are exported for lib/rag/chunk.ts, which
// needs to walk the same tree block-by-block instead of collapsing it to one
// string. Keeping one walker means export and retrieval can never disagree
// about what a document says.

type TipTapMark = { type: string };

export type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
};

export type TipTapDoc = { type?: string; content?: TipTapNode[] };

function applyMarks(text: string, marks: TipTapMark[] = []): string {
  let out = text;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        out = `**${out}**`;
        break;
      case "italic":
        out = `*${out}*`;
        break;
      case "underline":
        out = `<u>${out}</u>`;
        break;
      case "strike":
        out = `~~${out}~~`;
        break;
      case "code":
        out = `\`${out}\``;
        break;
    }
  }
  return out;
}

const altOf = (node: TipTapNode) => (node.attrs?.alt as string) || "image";

// A guest's image is a data URI holding the whole encoded file. Writing that
// out would bury a document's words under a megabyte of base64, in an exported
// file and in an embedding alike, so only the alt text survives.
const imageMarkdown = (node: TipTapNode) => {
  const src = (node.attrs?.src as string) ?? "";
  return `![${altOf(node)}](${src.startsWith("data:") ? "" : src})`;
};

// Render the inline content of a block node to Markdown (text + marks + breaks).
function renderInline(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "  \n";
      if (node.type === "text") return applyMarks(node.text ?? "", node.marks);
      if (node.type === "image") return imageMarkdown(node);
      return renderInline(node.content);
    })
    .join("");
}

// Plain-text inline: strip all marks, keep the text and line breaks.
function plainInline(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      if (node.type === "text") return node.text ?? "";
      if (node.type === "image") return altOf(node);
      return plainInline(node.content);
    })
    .join("");
}

function renderList(
  node: TipTapNode,
  ordered: boolean,
  plain: boolean,
): string {
  return (node.content ?? [])
    .map((item, i) => {
      const marker = ordered ? `${i + 1}.` : "-";
      const body = (item.content ?? [])
        .map((child) =>
          plain ? plainInline(child.content) : renderInline(child.content),
        )
        .join("\n");
      return `${marker} ${body}`;
    })
    .join("\n");
}

// A pipe table cannot hold a newline or a bare pipe inside a cell, so cell
// content is flattened onto one line. Colspans have no pipe representation
// either and simply render as a single cell.
function renderTable(node: TipTapNode, plain: boolean): string {
  const rows = (node.content ?? []).map((row) =>
    (row.content ?? []).map((cell) => {
      const text = (cell.content ?? [])
        .map((child) => renderBlock(child, plain))
        .join(" ")
        .replace(/\s*\n\s*/g, " ")
        .trim();
      return plain ? text : text.replace(/\|/g, "\\|");
    }),
  );
  if (rows.length === 0) return "";

  // Retrieval wants the cell text, not the table syntax, so plain output is
  // just the values a reader would scan.
  if (plain) return rows.map((cells) => cells.join("\t")).join("\n");

  const width = Math.max(...rows.map((cells) => cells.length));
  const line = (cells: string[]) =>
    `| ${Array.from({ length: width }, (_, i) => cells[i] ?? "").join(" | ")} |`;

  // Markdown has no headerless table — the delimiter row is what makes it a
  // table at all. Google Docs in turn has no header concept, so its tables
  // arrive as plain cells; promoting the first row reads far better than
  // emitting a blank one, and the row is still shown either way.
  return [
    line(rows[0]),
    line(Array.from({ length: width }, () => "---")),
    ...rows.slice(1).map(line),
  ].join("\n");
}

export function renderBlock(node: TipTapNode, plain: boolean): string {
  switch (node.type) {
    case "heading": {
      const level = Math.min(
        Math.max((node.attrs?.level as number) ?? 1, 1),
        6,
      );
      const text = plain
        ? plainInline(node.content)
        : renderInline(node.content);
      return plain ? text : `${"#".repeat(level)} ${text}`;
    }
    case "paragraph":
      return plain ? plainInline(node.content) : renderInline(node.content);
    case "bulletList":
      return renderList(node, false, plain);
    case "orderedList":
      return renderList(node, true, plain);
    case "blockquote": {
      const inner = (node.content ?? [])
        .map((child) => renderBlock(child, plain))
        .join("\n\n");
      if (plain) return inner;
      return inner
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    }
    case "table":
      return renderTable(node, plain);
    case "codeBlock": {
      const code = plainInline(node.content);
      if (plain) return code;
      const language = (node.attrs?.language as string) || "";
      return `\`\`\`${language}\n${code}\n\`\`\``;
    }
    default:
      return plain ? plainInline(node.content) : renderInline(node.content);
  }
}

function walk(data: string, plain: boolean): string {
  let doc: TipTapDoc = {};
  try {
    doc = JSON.parse(data) as TipTapDoc;
  } catch {
    return "";
  }
  return (doc.content ?? [])
    .map((node) => renderBlock(node, plain))
    .join("\n\n")
    .trim();
}

export function toMarkdown(data: string): string {
  return walk(data, false);
}

export function toPlainText(data: string): string {
  return walk(data, true);
}
