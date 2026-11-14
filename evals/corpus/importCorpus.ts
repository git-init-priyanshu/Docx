// node --env-file=.env evals/corpus/importCorpus.ts

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { previewOf } from "../../lib/documents/preview.ts";
import prisma from "../../prisma/prismaClient.ts";
import { articles, cacheFileOf } from "./articles.ts";
import { toTiptap } from "./toTiptap.ts";

// Sign-in is Google OAuth only and `.invalid` can never be a real address, so
// nobody can log in as this account.
const owner = await prisma.user.upsert({
  where: { email: "wikipedia@library.invalid" },
  create: {
    email: "wikipedia@library.invalid",
    username: "wikipedia",
    name: "Wikipedia",
  },
  update: {},
  select: { id: true },
});

let imported = 0;
let skipped = 0;
const failures: { title: string; reason: string }[] = [];

for (const [i, article] of articles.entries()) {
  const label = `[${i + 1}/${articles.length}] ${article.title}`;

  const file = cacheFileOf(article);
  if (!existsSync(file)) {
    skipped++;
    console.warn(`${label} - skipped, not downloaded`);
    continue;
  }

  const doc = toTiptap(readFileSync(file, "utf8"));
  if (doc.content.length === 0) {
    skipped++;
    console.warn(`${label} - skipped, converted to nothing`);
    continue;
  }

  const data = JSON.stringify(doc);
  const fields = {
    name: article.title,
    data,
    preview: previewOf(data),
    isPublic: true,
    source: "WIKIPEDIA",
    sourceUrl: `https://en.wikipedia.org/w/index.php?oldid=${article.revisionId}`,
  } as const;

  // Derived from the page id so a re-run updates the same row, and shaped
  // like the UUIDs every other document id uses.
  const hex = createHash("sha1")
    .update(`wikipedia:${article.pageId}`)
    .digest("hex");
  const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;

  try {
    await prisma.document.upsert({
      where: { id },
      create: { id, userId: owner.id, ...fields },
      update: fields,
    });
    imported++;
    console.log(`${label} - imported`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    failures.push({ title: article.title, reason });
    console.error(`${label} - FAILED: ${reason}`);
  }
}

console.log(
  `\n${imported} imported, ${skipped} skipped, ${failures.length} failed.`,
);

await prisma.$disconnect();

if (skipped > 0 || failures.length > 0) process.exitCode = 1;
