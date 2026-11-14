import { NO_CONTEXT_REPLY, streamAnswer } from "./answer.ts";
import { condenseQuery, type Turn } from "./query.ts";
import { ANSWER_CHUNK_LIMIT, rerank } from "./rerank.ts";
import { retrieve, type RetrievedChunk } from "./search.ts";

export type PipelineEvent =
  | { type: "status"; value: "searching" | "ranking" | "answering" }
  | { type: "retrieved"; chunks: RetrievedChunk[] }
  | { type: "passages"; chunks: RetrievedChunk[]; reranked: boolean }
  | { type: "text"; value: string };

export async function* answerQuestion(
  userId: string | null,
  question: string,
  history: Turn[],
): AsyncGenerator<PipelineEvent> {
  yield { type: "status", value: "searching" };
  // Rewrites the message into a standalone question using recent history,
  // since retrieval has no memory of prior turns.
  const condensed = await condenseQuery(question, history);
  // Hybrid search (vector + keyword) over every readable chunk: a wide, cheap
  // net whose ranking is rough.
  const candidates = await retrieve(userId, condensed);
  yield { type: "retrieved", chunks: candidates };

  yield { type: "status", value: "ranking" };
  // A slower model reads the query against each candidate directly, so the
  // final order reflects relevance rather than vector distance.
  let passages: RetrievedChunk[] = [];
  let reranked = true;
  if (candidates.length > 0) {
    try {
      passages = await rerank(condensed, candidates);
    } catch (e) {
      console.error("[rag] rerank failed, falling back to fused order:", e);
      passages = candidates.slice(0, ANSWER_CHUNK_LIMIT);
      reranked = false;
    }
  }
  yield { type: "passages", chunks: passages, reranked };

  if (passages.length === 0) {
    yield { type: "text", value: NO_CONTEXT_REPLY };
    return;
  }

  yield { type: "status", value: "answering" };
  // Writes the reply grounded only in the passages, streamed so the first
  // words reach the client while the rest is generated.
  for await (const piece of streamAnswer(question, passages, history)) {
    yield { type: "text", value: piece };
  }
}
