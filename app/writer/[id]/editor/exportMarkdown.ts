// Tiptap-JSON → Markdown / plain-text converters. Walks the stored document
// JSON (same node shape used by components/DocThumbnail.tsx) and renders clean
// output. Pure functions — safe to run client-side for guests and signed-in
// users alike.

type TipTapMark = { type: string };

type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
};

type TipTapDoc = { type?: string; content?: TipTapNode[] };

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

// Render the inline content of a block node to Markdown (text + marks + breaks).
function renderInline(nodes: TipTapNode[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "  \n";
      if (node.type === "text") return applyMarks(node.text ?? "", node.marks);
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

function renderBlock(node: TipTapNode, plain: boolean): string {
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
