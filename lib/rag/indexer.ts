// Brings a document's chunk rows in line with its current content.
//
// Two levels of skipping keep this cheap enough to run on every version
// snapshot: `Document.indexedHash` short-circuits documents that have not
// changed at all, and a per-chunk content hash means a one-paragraph edit to a
// long document re-embeds one chunk rather than seventy.
//
// Server-only — pulls in node:crypto through the chunker.

import { Prisma } from "@prisma/client";

import prisma from "../../prisma/prismaClient.ts";
import { chunkDocument, embeddingInput, hashDocument } from "./chunk.ts";
import { embedPassages, toVectorLiteral } from "./embed.ts";

export type IndexResult = {
  status: "indexed" | "unchanged" | "missing";
  embedded: number;
  reused: number;
  total: number;
};

export async function indexDocument(documentId: string): Promise<IndexResult> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, name: true, data: true, indexedHash: true },
  });
  if (!doc) return { status: "missing", embedded: 0, reused: 0, total: 0 };

  const documentHash = hashDocument(doc.data);
  if (doc.indexedHash === documentHash) {
    const total = await prisma.documentChunk.count({ where: { documentId } });
    return { status: "unchanged", embedded: 0, reused: total, total };
  }

  const chunks = chunkDocument(doc.name, doc.data);

  const existing = await prisma.documentChunk.findMany({
    where: { documentId },
    select: { ordinal: true, contentHash: true },
  });
  const hashByOrdinal = new Map(
    existing.map((row) => [row.ordinal, row.contentHash]),
  );

  const stale = chunks.filter(
    (chunk) => hashByOrdinal.get(chunk.ordinal) !== chunk.contentHash,
  );
  const vectors = await embedPassages(
    stale.map((chunk) => embeddingInput(chunk.headingPath, chunk.content)),
  );

  const writes: Prisma.PrismaPromise<unknown>[] = stale.map((chunk, i) =>
    prisma.$executeRaw`
      INSERT INTO "DocumentChunk" (
        id, "documentId", ordinal, "headingPath", content, "contentHash", embedding
      ) VALUES (
        gen_random_uuid()::text,
        ${documentId},
        ${chunk.ordinal},
        ${chunk.headingPath},
        ${chunk.content},
        ${chunk.contentHash},
        ${toVectorLiteral(vectors[i])}::vector
      )
      ON CONFLICT ("documentId", ordinal) DO UPDATE SET
        "headingPath" = EXCLUDED."headingPath",
        content       = EXCLUDED.content,
        "contentHash" = EXCLUDED."contentHash",
        embedding     = EXCLUDED.embedding
    `,
  );

  // The document may have shrunk; ordinals past the new end no longer exist.
  writes.push(
    prisma.$executeRaw`
      DELETE FROM "DocumentChunk"
      WHERE "documentId" = ${documentId} AND ordinal >= ${chunks.length}
    `,
  );

  // Written last and in the same transaction: if anything above fails, the
  // hash stays stale and the next run — snapshot or backfill — retries.
  writes.push(
    prisma.document.update({
      where: { id: documentId },
      data: { indexedHash: documentHash },
    }),
  );

  await prisma.$transaction(writes);

  return {
    status: "indexed",
    embedded: stale.length,
    reused: chunks.length - stale.length,
    total: chunks.length,
  };
}
