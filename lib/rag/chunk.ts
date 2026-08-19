// Splits a stored Tiptap document into retrieval units.
//
// Server-only: `node:crypto` cannot be bundled for the browser, and indexing
// only ever runs from a server action, a route handler, or the backfill
// script. Do not import this from a client component.
//
// Chunks never straddle a heading, so every hit can name the section it came
// from, and the heading path travels with the text into the embedding — a
// paragraph reading "we decided against it" is meaningless alone but precise
// under "Q3 Plan > Vendor evaluation > Datadog".

import { createHash } from "node:crypto";

// Relative and extension-qualified so `node` can run this module directly for
// the backfill script — the `@/` alias is a bundler-only convention.
import {
  renderBlock,
  type TipTapDoc,
  type TipTapNode,
} from "../tiptap/markdown.ts";

// Gemini has no public tokenizer, so size is approximated at ~4 chars/token.
// 1600 chars ≈ 400 tokens: large enough to hold a whole argument, small enough
// that eight of them leave the answer model room to think.
const TARGET_CHARS = 1600;
const HARD_SPLIT_CHARS = 2400;

export type Chunk = {
  ordinal: number;
  headingPath: string;
  content: string;
  contentHash: string;
};

const sha256 = (input: string) =>
  createHash("sha256").update(input).digest("hex");

/** Identity of a whole document, stored on `Document.indexedHash`. */
export const hashDocument = (data: string) => sha256(data);

/** Text actually sent to the embedding model for a chunk. */
export const embeddingInput = (headingPath: string, content: string) =>
  `${headingPath}\n\n${content}`;

// A pipe table holds almost no sentence boundaries, so the generic splitter
// would slice it mid-row and leave every piece after the first with no header
// to say what its columns mean. Split on rows and repeat the header instead.
function splitTable(markdown: string): string[] {
  const [header, divider, ...rows] = markdown.split("\n");
  if (divider === undefined) return [markdown];

  const heading = `${header}\n${divider}`;
  const pieces: string[] = [];
  let current = heading;

  for (const row of rows) {
    if (current !== heading && current.length + row.length + 1 > TARGET_CHARS) {
      pieces.push(current);
      current = heading;
    }
    current += `\n${row}`;
  }

  pieces.push(current);
  return pieces;
}

// A single block can exceed the target on its own — a wall-of-text paragraph,
// or a long code block. Prefer sentence boundaries, and only cut mid-sentence
// when one sentence is somehow longer than the hard ceiling.
function splitOversized(text: string): string[] {
  if (text.length <= HARD_SPLIT_CHARS) return [text];

  const pieces: string[] = [];
  let current = "";

  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (sentence.length > HARD_SPLIT_CHARS) {
      if (current) {
        pieces.push(current);
        current = "";
      }
      for (let i = 0; i < sentence.length; i += TARGET_CHARS) {
        pieces.push(sentence.slice(i, i + TARGET_CHARS));
      }
      continue;
    }

    if (current && current.length + sentence.length > TARGET_CHARS) {
      pieces.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }

  if (current) pieces.push(current);
  return pieces;
}

const headingLevelOf = (node: TipTapNode) =>
  Math.min(Math.max((node.attrs?.level as number) ?? 1, 1), 6);

// Documents commonly repeat their own name as the first h1, which would read
// back as "Job Board Tech Doc > Job Board Tech Doc > Overview".
const joinPath = (segments: string[]) =>
  segments
    .filter(Boolean)
    .filter(
      (segment, i, all) =>
        i === 0 || segment.toLowerCase() !== all[i - 1].toLowerCase(),
    )
    .join(" > ");

export function chunkDocument(documentName: string, data: string): Chunk[] {
  let doc: TipTapDoc = {};
  try {
    doc = JSON.parse(data) as TipTapDoc;
  } catch {
    return [];
  }

  const chunks: Chunk[] = [];
  // Index = heading level - 1. Holes are possible (an h3 under an h1) and are
  // filtered out when the path is built.
  const headings: string[] = [];
  const title = documentName.trim() || "Untitled Document";

  let currentPath = title;
  let buffer: string[] = [];
  let bufferChars = 0;
  // Counts only body text. A chunk holding nothing but its own heading line is
  // not worth an embedding.
  let bodyChars = 0;

  const flush = () => {
    const content = buffer.join("\n\n").trim();
    buffer = [];
    bufferChars = 0;
    const hadBody = bodyChars > 0;
    bodyChars = 0;
    if (!content || !hadBody) return;

    chunks.push({
      ordinal: chunks.length,
      headingPath: currentPath,
      content,
      contentHash: sha256(embeddingInput(currentPath, content)),
    });
  };

  const push = (text: string, isBody: boolean) => {
    for (const piece of splitOversized(text)) {
      // Never flush on a buffer holding only a heading line — that would drop
      // the heading and start the section's first chunk headless.
      if (bodyChars > 0 && bufferChars + piece.length > TARGET_CHARS) flush();
      buffer.push(piece);
      bufferChars += piece.length;
      if (isBody) bodyChars += piece.length;
    }
  };

  for (const node of doc.content ?? []) {
    if (node.type === "heading") {
      flush();

      const level = headingLevelOf(node);
      headings.length = level - 1;
      headings[level - 1] = renderBlock(node, true).trim();
      currentPath = joinPath([title, ...headings]);

      push(renderBlock(node, false).trim(), false);
      continue;
    }

    const rendered = renderBlock(node, false).trim();
    if (!rendered) continue;

    if (node.type === "table") {
      for (const piece of splitTable(rendered)) push(piece, true);
      continue;
    }

    push(rendered, true);
  }

  flush();
  return chunks;
}
