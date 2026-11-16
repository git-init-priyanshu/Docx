import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { chunkDocument, embeddingInput, hashDocument } from "../chunk.ts";

const paragraph = (text: string) => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});
const heading = (level: number, text: string) => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});
const doc = (...content: object[]) => JSON.stringify({ type: "doc", content });

describe("chunkDocument", () => {
  test("returns no chunks for invalid JSON", () => {
    assert.deepEqual(chunkDocument("Notes", "not json"), []);
  });

  test("returns no chunks for an empty document", () => {
    assert.deepEqual(chunkDocument("Notes", doc()), []);
  });

  test("labels chunks with the heading path under the title", () => {
    const chunks = chunkDocument(
      "Guide",
      doc(heading(1, "Setup"), paragraph("Install it."), heading(2, "Env"), paragraph("Set vars.")),
    );

    assert.deepEqual(
      chunks.map((chunk) => chunk.headingPath),
      ["Guide > Setup", "Guide > Setup > Env"],
    );
  });

  test("does not repeat the title when the first heading matches it", () => {
    const [chunk] = chunkDocument("Guide", doc(heading(1, "guide"), paragraph("Body.")));

    assert.equal(chunk.headingPath, "Guide");
  });

  test("skips a section that holds only its heading", () => {
    const chunks = chunkDocument(
      "Guide",
      doc(heading(1, "Empty"), heading(1, "Full"), paragraph("Words.")),
    );

    assert.equal(chunks.length, 1);
    assert.equal(chunks[0].headingPath, "Guide > Full");
  });

  test("keeps the heading line when the first paragraph alone fills a chunk", () => {
    const [chunk] = chunkDocument(
      "Guide",
      doc(heading(1, "Setup"), paragraph("word ".repeat(380).trim())),
    );

    assert.match(chunk.content, /^# Setup\n\n/);
  });

  test("uses a fallback title for a blank document name", () => {
    const [chunk] = chunkDocument("   ", doc(paragraph("Hello.")));

    assert.equal(chunk.headingPath, "Untitled Document");
  });

  test("splits a long section and numbers chunks in order", () => {
    const sentence = "This is a sentence of moderate length for chunking. ";
    const chunks = chunkDocument(
      "Long",
      doc(paragraph(sentence.repeat(120))),
    );

    assert.ok(chunks.length > 1);
    assert.deepEqual(
      chunks.map((chunk) => chunk.ordinal),
      chunks.map((_, index) => index),
    );
    for (const chunk of chunks) assert.ok(chunk.content.length <= 2400);
  });

  test("cuts a single sentence longer than the hard ceiling", () => {
    const chunks = chunkDocument("Long", doc(paragraph("a".repeat(7000))));

    assert.ok(chunks.length >= 3);
    for (const chunk of chunks) assert.ok(chunk.content.length <= 2400);
  });

  test("repeats the table header in every table chunk", () => {
    const row = (cells: string[]) => ({
      type: "tableRow",
      content: cells.map((cell) => ({
        type: "tableCell",
        content: [paragraph(cell)],
      })),
    });
    const rows = Array.from({ length: 120 }, (_, i) => row([`name ${i}`, `value ${i} ${"x".repeat(30)}`]));
    const table = {
      type: "table",
      content: [row(["Name", "Value"]), ...rows],
    };

    const chunks = chunkDocument("Data", doc(table));

    assert.ok(chunks.length > 1);
    for (const chunk of chunks) assert.match(chunk.content, /^\| ?Name/);
  });

  test("content hash follows heading path and content", () => {
    const a = chunkDocument("Guide", doc(paragraph("Same.")))[0];
    const b = chunkDocument("Other", doc(paragraph("Same.")))[0];

    assert.notEqual(a.contentHash, b.contentHash);
    assert.equal(
      a.contentHash,
      chunkDocument("Guide", doc(paragraph("Same.")))[0].contentHash,
    );
  });
});

describe("hashDocument and embeddingInput", () => {
  test("hashDocument is stable and sensitive to content", () => {
    assert.equal(hashDocument("a"), hashDocument("a"));
    assert.notEqual(hashDocument("a"), hashDocument("b"));
  });

  test("embeddingInput puts the heading path before the content", () => {
    assert.equal(embeddingInput("A > B", "text"), "A > B\n\ntext");
  });
});
