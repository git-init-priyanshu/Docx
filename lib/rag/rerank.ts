// Second-stage ranking: cuts the fused candidate set down to what actually
// answers the question.
//
// Fusion ranks by lexical and semantic proximity, which is not the same as
// relevance — a passage can score well for repeating the question's words while
// answering something else. A model reading the passages catches that.
//
// Every failure path falls back to the incoming order. A reranker that throws
// must degrade the answer, never prevent one.

import { GoogleGenerativeAI } from "@google/generative-ai";

import type { RetrievedChunk } from "./search.ts";

export const RERANK_MODEL = "gemini-2.5-flash";
export const ANSWER_CHUNK_LIMIT = 8;

// Enough of each passage to judge relevance, short enough that thirty of them
// stay a cheap prompt.
const PREVIEW_CHARS = 700;

const buildPrompt = (query: string, candidates: RetrievedChunk[]) =>
  [
    "You rank passages by how well they answer a question.",
    "",
    `Question: ${query}`,
    "",
    "Passages:",
    ...candidates.map(
      (chunk, i) =>
        `[${i}] (${chunk.headingPath}) ${chunk.content.slice(0, PREVIEW_CHARS)}`,
    ),
    "",
    `Reply with JSON only: an array of at most ${ANSWER_CHUNK_LIMIT} passage`,
    "numbers, most useful first. Omit passages that do not help answer the",
    "question, even if that leaves the array empty.",
  ].join("\n");

// Returns null when the reply could not be understood, distinct from an empty
// array — which is the model saying none of the passages are relevant, and must
// be honoured rather than papered over with a fallback.
function parseOrder(raw: string, candidateCount: number): number[] | null {
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;

  const seen = new Set<number>();
  const order: number[] = [];
  for (const value of parsed) {
    const index = typeof value === "number" ? value : Number(value);
    if (!Number.isInteger(index)) continue;
    if (index < 0 || index >= candidateCount) continue;
    if (seen.has(index)) continue;
    seen.add(index);
    order.push(index);
  }
  return order;
}

export async function rerank(
  query: string,
  candidates: RetrievedChunk[],
): Promise<RetrievedChunk[]> {
  if (candidates.length <= 1) return candidates;

  const key = process.env.GEMINI_API_KEY;
  if (!key) return candidates.slice(0, ANSWER_CHUNK_LIMIT);

  try {
    const model = new GoogleGenerativeAI(key).getGenerativeModel({
      model: RERANK_MODEL,
      generationConfig: { responseMimeType: "application/json" },
    });
    const result = await model.generateContent(buildPrompt(query, candidates));
    const order = parseOrder(result.response.text(), candidates.length);
    if (order === null) return candidates.slice(0, ANSWER_CHUNK_LIMIT);

    return order.slice(0, ANSWER_CHUNK_LIMIT).map((i) => candidates[i]);
  } catch (e) {
    console.error("[rag] rerank failed, falling back to fused order:", e);
    return candidates.slice(0, ANSWER_CHUNK_LIMIT);
  }
}
