// Indexes every document for retrieval.
//
// Safe to re-run: documents whose content has not changed since their last
// successful index are skipped without an API call, and within a changed
// document only chunks whose text actually differs are re-embedded. Run it
// after the first deploy, and again after any change to chunking or to the
// embedding model, which invalidate every stored hash.
//
//   node --env-file=.env scripts/backfill-embeddings.ts
//
// A failure on one document is reported and does not stop the rest.

import prisma from "../prisma/prismaClient.ts";
import { indexDocument } from "../lib/rag/indexer.ts";

const documents = await prisma.document.findMany({
  orderBy: { updatedAt: "desc" },
  select: { id: true, name: true },
});

console.log(`Indexing ${documents.length} documents\n`);

let embedded = 0;
let reused = 0;
const failures: { name: string; reason: string }[] = [];

for (const [i, doc] of documents.entries()) {
  const label = `[${i + 1}/${documents.length}] ${doc.name}`;
  try {
    const result = await indexDocument(doc.id);
    embedded += result.embedded;
    reused += result.reused;
    console.log(
      `${label} — ${result.status}, ${result.total} chunks ` +
        `(${result.embedded} embedded, ${result.reused} reused)`,
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    failures.push({ name: doc.name, reason });
    console.error(`${label} — FAILED: ${reason}`);
  }
}

console.log(
  `\nDone. ${embedded} chunks embedded, ${reused} reused, ` +
    `${failures.length} documents failed.`,
);

for (const failure of failures) {
  console.error(`  ${failure.name}: ${failure.reason}`);
}

await prisma.$disconnect();

if (failures.length > 0) process.exitCode = 1;
