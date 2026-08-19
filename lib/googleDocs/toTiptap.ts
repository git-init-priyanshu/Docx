import type {
  Alignment,
  GoogleDoc,
  NamedStyleType,
  Paragraph,
  RgbColor,
  StructuralElement,
  Table,
  TextStyle,
} from "./types";

export type TiptapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
};

/**
 * Content the editor has no node for. Reported to the user after an import
 * rather than dropped in silence.
 */
export type DroppedContent = {
  images: number;
};

export type ImportResult = {
  doc: TiptapNode;
  dropped: DroppedContent;
};

const HEADING_LEVELS: Partial<Record<NamedStyleType, number>> = {
  TITLE: 1,
  SUBTITLE: 2,
  HEADING_1: 1,
  HEADING_2: 2,
  HEADING_3: 3,
  HEADING_4: 4,
  HEADING_5: 5,
  HEADING_6: 6,
};

const TEXT_ALIGN: Partial<Record<Alignment, string>> = {
  CENTER: "center",
  END: "right",
  JUSTIFIED: "justify",
};

const toHex = (rgb: RgbColor | undefined) => {
  if (!rgb) return null;
  const channel = (value: number | undefined) =>
    Math.round(Math.max(0, Math.min(1, value ?? 0)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(rgb.red)}${channel(rgb.green)}${channel(rgb.blue)}`;
};

const foregroundOf = (style: TextStyle | undefined) =>
  toHex(style?.foregroundColor?.color?.rgbColor);

const fontOf = (style: TextStyle | undefined) =>
  style?.weightedFontFamily?.fontFamily ?? null;

/**
 * Google writes an explicit colour and font family onto nearly every run,
 * usually the document default. Emitting those verbatim would pin imported
 * text to black and to Arial, which fights the app's own theme and dark mode.
 * Comparing against the NORMAL_TEXT named style keeps only what the author
 * actually changed.
 */
const marksFor = (style: TextStyle | undefined, baseline: TextStyle | undefined) => {
  const marks: TiptapMark[] = [];
  if (!style) return marks;

  if (style.bold) marks.push({ type: "bold" });
  if (style.italic) marks.push({ type: "italic" });
  if (style.underline && !style.link) marks.push({ type: "underline" });
  if (style.strikethrough) marks.push({ type: "strike" });

  const href = style.link?.url;
  if (href) marks.push({ type: "link", attrs: { href } });

  const textStyleAttrs: Record<string, unknown> = {};

  const color = foregroundOf(style);
  if (color && color !== foregroundOf(baseline)) textStyleAttrs.color = color;

  const fontFamily = fontOf(style);
  if (fontFamily && fontFamily !== fontOf(baseline))
    textStyleAttrs.fontFamily = fontFamily;

  if (Object.keys(textStyleAttrs).length > 0)
    marks.push({ type: "textStyle", attrs: textStyleAttrs });

  const highlight = toHex(style.backgroundColor?.color?.rgbColor);
  if (highlight && highlight !== "#ffffff")
    marks.push({ type: "highlight", attrs: { color: highlight } });

  return marks;
};

/**
 * Within a paragraph Google encodes a soft line break as a vertical tab and
 * terminates the paragraph itself with a newline. The newline is structural
 * and already expressed by the block boundary, so only the vertical tab
 * becomes a node.
 */
const runToNodes = (text: string, marks: TiptapMark[]) => {
  const nodes: TiptapNode[] = [];
  const segments = text.replace(/\n/g, "").split("\v");

  segments.forEach((segment, index) => {
    if (index > 0) nodes.push({ type: "hardBreak" });
    if (segment.length === 0) return;
    nodes.push(
      marks.length > 0
        ? { type: "text", text: segment, marks }
        : { type: "text", text: segment },
    );
  });

  return nodes;
};

type ListPosition = {
  listId: string;
  level: number;
  ordered: boolean;
};

type Block = {
  node: TiptapNode;
  list: ListPosition | null;
};

const paragraphToBlock = (
  paragraph: Paragraph,
  source: GoogleDoc,
  baseline: TextStyle | undefined,
  dropped: DroppedContent,
): Block | null => {
  const content: TiptapNode[] = [];
  let isHorizontalRule = false;

  for (const element of paragraph.elements ?? []) {
    if (element.horizontalRule) {
      isHorizontalRule = true;
      continue;
    }
    if (element.inlineObjectElement) {
      dropped.images += 1;
      continue;
    }
    if (!element.textRun?.content) continue;

    content.push(
      ...runToNodes(
        element.textRun.content,
        marksFor(element.textRun.textStyle, baseline),
      ),
    );
  }

  if (isHorizontalRule) return { node: { type: "horizontalRule" }, list: null };

  const bullet = paragraph.bullet;
  const level = bullet?.nestingLevel ?? 0;
  const glyph = bullet?.listId
    ? source.lists?.[bullet.listId]?.listProperties?.nestingLevels?.[level]
    : undefined;

  const list: ListPosition | null = bullet?.listId
    ? {
        listId: bullet.listId,
        level,
        ordered: Boolean(glyph?.glyphType) && !glyph?.glyphSymbol,
      }
    : null;

  // List items hold paragraphs, so a heading style inside a list is ignored.
  const headingLevel = list
    ? undefined
    : HEADING_LEVELS[paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT"];

  const attrs: Record<string, unknown> = {};
  if (headingLevel) attrs.level = headingLevel;

  const align = TEXT_ALIGN[paragraph.paragraphStyle?.alignment ?? "START"];
  if (align) attrs.textAlign = align;

  const node: TiptapNode = {
    type: headingLevel ? "heading" : "paragraph",
  };
  if (Object.keys(attrs).length > 0) node.attrs = attrs;
  if (content.length > 0) node.content = content;

  return { node, list };
};

/**
 * Google reports list membership per paragraph as a flat (listId, nestingLevel)
 * pair. Tiptap needs the tree, so consecutive members of the same list are
 * folded back into nested bulletList/orderedList nodes with a level stack.
 */
const nestLists = (blocks: Block[]) => {
  const content: TiptapNode[] = [];
  let stack: { level: number; node: TiptapNode }[] = [];
  let currentListId: string | null = null;

  for (const block of blocks) {
    if (!block.list) {
      stack = [];
      currentListId = null;
      content.push(block.node);
      continue;
    }

    if (block.list.listId !== currentListId) {
      stack = [];
      currentListId = block.list.listId;
    }

    while (stack.length > 0 && stack[stack.length - 1].level > block.list.level)
      stack.pop();

    if (stack.length === 0 || stack[stack.length - 1].level < block.list.level) {
      const listNode: TiptapNode = {
        type: block.list.ordered ? "orderedList" : "bulletList",
        content: [],
      };

      const parent = stack[stack.length - 1]?.node;
      if (!parent) {
        content.push(listNode);
      } else {
        const lastItem = parent.content?.[parent.content.length - 1];
        if (lastItem) {
          lastItem.content = [...(lastItem.content ?? []), listNode];
        } else {
          parent.content = [{ type: "listItem", content: [listNode] }];
        }
      }

      stack.push({ level: block.list.level, node: listNode });
    }

    const list = stack[stack.length - 1].node;
    list.content = [
      ...(list.content ?? []),
      { type: "listItem", content: [block.node] },
    ];
  }

  return content;
};

/**
 * A cell holds structural elements of its own, so this recurses back through
 * the same walker the body uses — which is what lets a cell carry lists,
 * headings and further tables.
 *
 * Google has no notion of a header row: the first row is data like any other,
 * so every cell is imported as a plain one.
 */
function tableToNode(
  table: Table,
  source: GoogleDoc,
  baseline: TextStyle | undefined,
  dropped: DroppedContent,
): TiptapNode | null {
  const rows = table.tableRows ?? [];
  if (rows.length === 0) return null;

  return {
    type: "table",
    content: rows.map((row) => ({
      type: "tableRow",
      content: (row.tableCells ?? []).map((cell) => {
        const content = elementsToNodes(
          cell.content ?? [],
          source,
          baseline,
          dropped,
        );
        return {
          type: "tableCell",
          // A cell must hold at least one block, and Google emits empty cells.
          content: content.length > 0 ? content : [{ type: "paragraph" }],
        };
      }),
    })),
  };
}

function elementsToNodes(
  elements: StructuralElement[],
  source: GoogleDoc,
  baseline: TextStyle | undefined,
  dropped: DroppedContent,
): TiptapNode[] {
  const blocks: Block[] = [];

  for (const element of elements) {
    if (element.table) {
      const node = tableToNode(element.table, source, baseline, dropped);
      if (node) blocks.push({ node, list: null });
      continue;
    }
    if (!element.paragraph) continue;

    const block = paragraphToBlock(element.paragraph, source, baseline, dropped);
    if (block) blocks.push(block);
  }

  return nestLists(blocks);
}

export const toTiptap = (source: GoogleDoc): ImportResult => {
  const dropped: DroppedContent = { images: 0 };
  const baseline = source.namedStyles?.styles?.find(
    (style) => style.namedStyleType === "NORMAL_TEXT",
  )?.textStyle;

  const content = elementsToNodes(
    source.body?.content ?? [],
    source,
    baseline,
    dropped,
  );

  return {
    doc: {
      type: "doc",
      content: content.length > 0 ? content : [{ type: "paragraph" }],
    },
    dropped,
  };
};
