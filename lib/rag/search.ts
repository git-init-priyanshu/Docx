// Hybrid retrieval over the caller's documents.
//
// Two independent rankings are fused rather than blended by raw score: cosine
// distance and ts_rank_cd are on incomparable scales, so any weighted sum is
// arbitrary. Reciprocal Rank Fusion only reads each result's *position*, which
// makes it scale-free and is why it holds up without per-corpus tuning.
//
// The keyword half exists for the queries embeddings are worst at — an exact
// identifier, an error string, a person's name. The vector half exists for the
// queries keywords are worst at — a question phrased nothing like the source.

import { Prisma } from "@prisma/client";

import prisma from "../../prisma/prismaClient.ts";
import { embedQuery, toVectorLiteral } from "./embed.ts";

// Candidates pulled from each ranking before fusion.
const PER_RANKING_LIMIT = 30;
export const CANDIDATE_LIMIT = 30;

// Standard RRF damping. Large enough that the top few results do not dominate,
// small enough that rank still matters past the first page.
const RRF_K = 60;

export type RetrievedChunk = {
  id: string;
  documentId: string;
  documentName: string;
  headingPath: string;
  content: string;
  score: number;
};

/** Documents the user may read: those they own or collaborate on. */
export async function accessibleDocumentIds(userId: string): Promise<string[]> {
  const rows = await prisma.userOnDocument.findMany({
    where: { userId },
    select: { documentId: true },
  });
  return rows.map((row) => row.documentId);
}

export async function retrieve(
  userId: string,
  query: string,
): Promise<RetrievedChunk[]> {
  const documentIds = await accessibleDocumentIds(userId);
  if (documentIds.length === 0) return [];

  const vector = toVectorLiteral(await embedQuery(query));
  const ids = Prisma.join(documentIds);

  return prisma.$queryRaw<RetrievedChunk[]>`
    WITH semantic AS (
      SELECT c.id,
             ROW_NUMBER() OVER (ORDER BY c.embedding <=> ${vector}::vector) AS rank
      FROM "DocumentChunk" c
      WHERE c."documentId" IN (${ids})
        AND c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${vector}::vector
      LIMIT ${PER_RANKING_LIMIT}
    ),
    keyword AS (
      SELECT c.id,
             ROW_NUMBER() OVER (ORDER BY ts_rank_cd(c.tsv, q) DESC) AS rank
      FROM "DocumentChunk" c,
           websearch_to_tsquery('english', ${query}) q
      WHERE c."documentId" IN (${ids})
        AND c.tsv @@ q
      ORDER BY ts_rank_cd(c.tsv, q) DESC
      LIMIT ${PER_RANKING_LIMIT}
    ),
    fused AS (
      SELECT COALESCE(semantic.id, keyword.id) AS id,
             COALESCE(1.0 / (${RRF_K} + semantic.rank), 0)
           + COALESCE(1.0 / (${RRF_K} + keyword.rank), 0) AS score
      FROM semantic
      FULL OUTER JOIN keyword ON semantic.id = keyword.id
    )
    SELECT c.id,
           c."documentId"  AS "documentId",
           d.name          AS "documentName",
           c."headingPath" AS "headingPath",
           c.content,
           fused.score::float8 AS score
    FROM fused
    JOIN "DocumentChunk" c ON c.id = fused.id
    JOIN "Document" d ON d.id = c."documentId"
    ORDER BY fused.score DESC
    LIMIT ${CANDIDATE_LIMIT}
  `;
}
