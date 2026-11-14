// node evals/corpus/downloadHtml.ts

import { existsSync, mkdirSync, writeFileSync } from "node:fs";

import { articles, cacheDir, cacheFileOf } from "./articles.ts";
import { fetchWikipedia } from "./wikipedia.ts";

mkdirSync(cacheDir, { recursive: true });

let downloaded = 0;
let cached = 0;
const failures: { title: string; reason: string }[] = [];

for (const [i, article] of articles.entries()) {
  const label = `[${i + 1}/${articles.length}] ${article.title}`;
  const file = cacheFileOf(article);
  if (existsSync(file)) {
    cached++;
    continue;
  }

  try {
    const response = await fetchWikipedia(
      `https://en.wikipedia.org/w/rest.php/v1/revision/${article.revisionId}/html`,
    );
    writeFileSync(file, await response.text());
    downloaded++;
    console.log(`${label} - downloaded`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    failures.push({ title: article.title, reason });
    console.error(`${label} - FAILED: ${reason}`);
  }
}

console.log(
  `\n${downloaded} downloaded, ${cached} already cached, ${failures.length} failed.`,
);

if (failures.length > 0) process.exitCode = 1;
