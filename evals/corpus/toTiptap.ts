import { parse, type HTMLElement, type Node } from "node-html-parser";
import type { TipTapNode } from "../../lib/tiptap/markdown.ts";

const REMOVE_SELECTORS = [
  "style",
  "script",
  "link",
  "meta",
  "figure",
  "img",
  "sup.mw-ref",
  "sup.reference",
  ".mw-editsection",
  ".hatnote",
  ".navbox",
  ".navbar",
  ".navbox-styles",
  ".infobox",
  ".sidebar",
  ".metadata",
  ".ambox",
  ".noprint",
  ".reflist",
  ".refbegin",
  ".mw-references-wrap",
  "ol.references",
  ".thumb",
  ".gallery",
  ".portalbox",
  ".side-box",
  ".sistersitebox",
  ".shortdescription",
  ".mw-empty-elt",
  ".toc",
  ".coordinates",
  '[role="navigation"]',
];

const REFERENCE_HEADINGS = new Set([
  "see also",
  "notes",
  "references",
  "footnotes",
  "citations",
  "sources",
  "bibliography",
  "further reading",
  "external links",
  "works cited",
  "explanatory notes",
  "notes and references",
  "references and notes",
]);

const BLOCK_CONTAINERS = new Set(["SECTION", "DIV", "CENTER", "SPAN"]);

// Marks are plain names here and turned into mark objects once runs are merged.
function inline(
  el: HTMLElement,
  baseMarks: string[] = [],
  skipLists = false,
): TipTapNode[] {
  const runs: { text: string; marks: string[] }[] = [];

  const visit = (node: Node, marks: string[]) => {
    if (node.nodeType === 3) {
      runs.push({ text: node.text, marks });
      return;
    }
    if (node.nodeType !== 1) return;

    const tag = (node as HTMLElement).tagName;
    if (tag === "BR") {
      runs.push({ text: " ", marks });
      return;
    }
    if (skipLists && (tag === "UL" || tag === "OL")) return;

    let next = marks;
    if ((tag === "B" || tag === "STRONG") && !marks.includes("bold")) {
      next = [...marks, "bold"];
    }
    if ((tag === "I" || tag === "EM") && !marks.includes("italic")) {
      next = [...marks, "italic"];
    }
    for (const child of node.childNodes) visit(child, next);
  };

  for (const child of el.childNodes) visit(child, baseMarks);

  const collapsed: { text: string; marks: string[] }[] = [];
  let lastIsSpace = true;
  for (const run of runs) {
    let text = run.text.replace(/\s+/g, " ");
    if (lastIsSpace && text.startsWith(" ")) text = text.slice(1);
    if (!text) continue;
    lastIsSpace = text.endsWith(" ");
    collapsed.push({ text, marks: run.marks });
  }
  const last = collapsed[collapsed.length - 1];
  if (last) {
    last.text = last.text.trimEnd();
    if (!last.text) collapsed.pop();
  }

  const merged: { text: string; marks: string[] }[] = [];
  for (const run of collapsed) {
    const prev = merged[merged.length - 1];
    if (prev && prev.marks.join(",") === run.marks.join(",")) {
      prev.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }

  return merged.map((run) =>
    run.marks.length
      ? {
          type: "text",
          text: run.text,
          marks: run.marks.map((type) => ({ type })),
        }
      : { type: "text", text: run.text },
  );
}

function buildTable(table: HTMLElement): TipTapNode[] {
  const out: TipTapNode[] = [];

  const caption = table.children.find((child) => child.tagName === "CAPTION");
  const captionContent = caption ? inline(caption, ["bold"]) : [];
  if (captionContent.length) {
    out.push({ type: "paragraph", content: captionContent });
  }

  const rows: TipTapNode[] = [];
  const carried = new Map<number, { cell: TipTapNode; rowsLeft: number }>();
  for (const tr of table.querySelectorAll("tr")) {
    // Skip rows of tables nested inside this table's cells.
    if (tr.closest("table") !== table) continue;

    const sourceCells = tr.children.filter(
      (cell) => cell.tagName === "TH" || cell.tagName === "TD",
    );
    if (!sourceCells.length) continue;

    const cells: TipTapNode[] = [];
    // The trailing undefined drains carried cells after the last source cell.
    for (const cell of [...sourceCells, undefined]) {
      while (carried.has(cells.length)) {
        const column = cells.length;
        const entry = carried.get(column)!;
        cells.push(entry.cell);
        if (--entry.rowsLeft === 0) carried.delete(column);
      }
      if (!cell) break;

      const type = cell.tagName === "TH" ? "tableHeader" : "tableCell";
      const colspan = parseInt(cell.getAttribute("colspan") ?? "", 10) || 1;
      const rowspan = parseInt(cell.getAttribute("rowspan") ?? "", 10) || 1;
      const content = inline(cell);
      // Rowspans repeat the value downward since each row is a record;
      // colspans pad with empty cells so the text is not duplicated sideways.
      const placed: TipTapNode[] = [
        {
          type,
          attrs: { colspan: 1, rowspan: 1, colwidth: null },
          content: [
            content.length
              ? { type: "paragraph", content }
              : { type: "paragraph" },
          ],
        },
        ...Array.from({ length: colspan - 1 }, () => ({
          type,
          attrs: { colspan: 1, rowspan: 1, colwidth: null },
          content: [{ type: "paragraph" }],
        })),
      ];
      if (rowspan > 1) {
        placed.forEach((placedCell, offset) => {
          carried.set(cells.length + offset, {
            cell: placedCell,
            rowsLeft: rowspan - 1,
          });
        });
      }
      cells.push(...placed);
    }
    // Rows are padded to the table width when rendered, so trailing empty
    // cells (such as a huge colspan's padding) carry no information.
    cells.length = cells.findLastIndex((cell) => cell.content![0].content) + 1;
    if (!cells.length) continue;
    rows.push({ type: "tableRow", content: cells });
  }

  if (rows.length) out.push({ type: "table", content: rows });
  return out;
}

function walk(el: HTMLElement, out: TipTapNode[]) {
  for (const child of el.children) {
    const tag = child.tagName;

    if (/^H[2-6]$/.test(tag)) {
      const content = inline(child);
      if (content.length) {
        out.push({
          type: "heading",
          attrs: { level: Number(tag[1]) },
          content,
        });
      }
    } else if (tag === "P") {
      const content = inline(child);
      if (content.length) out.push({ type: "paragraph", content });
    } else if (tag === "UL" || tag === "OL") {
      const items: TipTapNode[] = [];
      for (const li of child.querySelectorAll("li")) {
        const content = inline(li, [], true);
        if (content.length) {
          items.push({
            type: "listItem",
            content: [{ type: "paragraph", content }],
          });
        }
      }
      if (items.length) {
        out.push({
          type: tag === "UL" ? "bulletList" : "orderedList",
          content: items,
        });
      }
    } else if (tag === "DL") {
      for (const entry of child.children) {
        if (entry.tagName !== "DT" && entry.tagName !== "DD") continue;
        const content = inline(entry, entry.tagName === "DT" ? ["bold"] : []);
        if (content.length) out.push({ type: "paragraph", content });
      }
    } else if (tag === "BLOCKQUOTE") {
      const paragraphs: TipTapNode[] = [];
      const paragraphEls = child.children.filter((c) => c.tagName === "P");
      for (const p of paragraphEls.length ? paragraphEls : [child]) {
        const content = inline(p);
        if (content.length) paragraphs.push({ type: "paragraph", content });
      }
      if (paragraphs.length) {
        out.push({ type: "blockquote", content: paragraphs });
      }
    } else if (tag === "PRE") {
      const text = child.text;
      if (text.trim()) {
        out.push({ type: "codeBlock", content: [{ type: "text", text }] });
      }
    } else if (tag === "TABLE") {
      out.push(...buildTable(child));
    } else if (BLOCK_CONTAINERS.has(tag)) {
      walk(child, out);
    }
  }
}

export function toTiptap(html: string): { type: "doc"; content: TipTapNode[] } {
  const root = parse(html);

  for (const el of root.querySelectorAll('[typeof="mw:Extension/math"]')) {
    // Nested matches are already detached once their ancestor is replaced.
    if (!el.parentNode) continue;
    // Native MathML carries its LaTeX source only in the data-mw JSON.
    const latex = JSON.parse(
      el.getAttribute("data-mw") ?? "{}",
    ).body?.extsrc?.trim();
    if (!latex) {
      el.remove();
      continue;
    }
    // replaceWith parses strings as HTML, so escape the LaTeX.
    const escaped = `$${latex}$`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    el.replaceWith(escaped);
  }

  for (const el of root.querySelectorAll(REMOVE_SELECTORS.join(","))) {
    el.remove();
  }

  // Parsoid wraps each section with its heading as the first element child.
  for (const section of root.querySelectorAll("section")) {
    const heading = section.children[0];
    if (heading?.tagName !== "H2") continue;
    if (REFERENCE_HEADINGS.has(heading.text.trim().toLowerCase())) {
      section.remove();
    }
  }

  const content: TipTapNode[] = [];
  walk(root.querySelector("body") ?? root, content);
  return { type: "doc", content };
}
