import { chat, isConfigured } from "../ai/openrouter.ts";
import { RERANK_MODEL } from "../ai/models.ts";

import type { RetrievedChunk } from "./search.ts";

export const ANSWER_CHUNK_LIMIT = 8;

const buildPrompt = (query: string, retrievedChunks: RetrievedChunk[]) => {
  const passages = retrievedChunks
    .map((chunk, i) => `[${i}] (${chunk.headingPath}) ${chunk.content}`)
    .join("\n");

  return `
    You rank passages by how well they answer a question.

    Question: ${query}

    Passages:
    ${passages}

    Reply with JSON only, in the form {"order": [3, 0, 7]}: at most
    ${ANSWER_CHUNK_LIMIT} passage numbers, most useful first. Omit passages that
    do not help answer the question, even if that leaves the array empty.
  `;
};

// Pulls the list of passage numbers out of the reply, whether the model wrapped
// it in the requested object, returned a bare array, or buried either in prose.
function extractList(raw: string): unknown[] | null {
  const candidates = [
    raw.match(/\{[\s\S]*\}/)?.[0],
    raw.match(/\[[\s\S]*\]/)?.[0],
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(candidate);
    } catch {
      continue;
    }
    if (Array.isArray(parsed)) return parsed;

    const order = (parsed as { order?: unknown })?.order;
    if (Array.isArray(order)) return order;
  }
  return null;
}

// Safely parses the model's JSON reply into valid passage indices, dropping
// junk, duplicates, and out-of-range values. Returns null when the reply
// could not be understood, distinct from an empty array, which is the model
// saying none of the passages are relevant, and must be honoured rather than
// papered over with a fallback.
function parseOrder(
  raw: string,
  retrievedChunksCount: number,
): number[] | null {
  const parsed = extractList(raw);
  if (!parsed) return null;

  const seen = new Set<number>();
  const order: number[] = [];
  for (const value of parsed) {
    const index = typeof value === "number" ? value : Number(value);
    if (!Number.isInteger(index)) continue;
    if (index < 0 || index >= retrievedChunksCount) continue;
    if (seen.has(index)) continue;
    seen.add(index);
    order.push(index);
  }
  return order;
}

export async function rerank(
  query: string,
  retrievedChunks: RetrievedChunk[],
): Promise<RetrievedChunk[]> {
  if (retrievedChunks.length <= 1) return retrievedChunks;

  if (!isConfigured()) return retrievedChunks.slice(0, ANSWER_CHUNK_LIMIT);

  const reply = await chat({
    model: RERANK_MODEL,
    prompt: buildPrompt(query, retrievedChunks),
    json: true,
    temperature: 0,
    reasoning: false,
  });
  const order = parseOrder(reply, retrievedChunks.length);
  if (order === null) {
    throw new Error("Reranker reply held no list of passage numbers");
  }

  return order.slice(0, ANSWER_CHUNK_LIMIT).map((i) => retrievedChunks[i]);
}
