// node evals/corpus/corpusStats.ts

import { existsSync, readFileSync } from "node:fs";

import { chunkDocument } from "../../lib/rag/chunk.ts";
import { toPlainText } from "../../lib/tiptap/markdown.ts";
import { articles, cacheFileOf } from "./articles.ts";
import { toTiptap } from "./toTiptap.ts";

let notDownloaded = 0;
let empty = 0;
let chunks = 0;
const nodeCounts: Record<string, number> = {};
const sizes: { title: string; chars: number }[] = [];

for (const article of articles) {
  const file = cacheFileOf(article);
  if (!existsSync(file)) {
    notDownloaded++;
    continue;
  }

  const doc = toTiptap(readFileSync(file, "utf8"));
  if (doc.content.length === 0) {
    empty++;
    continue;
  }

  const data = JSON.stringify(doc);
  sizes.push({ title: article.title, chars: toPlainText(data).length });
  chunks += chunkDocument(article.title, data).length;
  for (const node of doc.content) {
    nodeCounts[node.type] = (nodeCounts[node.type] ?? 0) + 1;
  }
}

sizes.sort((a, b) => b.chars - a.chars);
const chars = sizes.reduce((sum, size) => sum + size.chars, 0);

console.log(
  `${sizes.length} converted, ${notDownloaded} not downloaded, ${empty} empty`,
);
console.log(`${chars} plain-text characters, ${chunks} chunks`);
console.log("\nTop-level nodes:", nodeCounts);
console.log("\nLargest:", sizes.slice(0, 5));
console.log("\nSmallest:", sizes.slice(-5));
