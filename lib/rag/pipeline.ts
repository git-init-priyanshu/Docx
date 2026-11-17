import { propagateAttributes, startObservation } from "@langfuse/tracing";
import { withObservation } from "../ai/langfuse.ts";
import { NO_CONTEXT_REPLY, streamAnswer } from "./answer.ts";
import { condenseQuery, type Turn } from "./query.ts";
import { ANSWER_CHUNK_LIMIT, rerank } from "./rerank.ts";
import { retrieve, type RetrievedChunk } from "./search.ts";

export type PipelineEvent =
  | { type: "status"; value: "searching" | "ranking" | "answering" }
  | { type: "retrieved"; chunks: RetrievedChunk[] }
  | { type: "passages"; chunks: RetrievedChunk[]; reranked: boolean }
  | { type: "text"; value: string };

const summarizeChunks = (chunks: RetrievedChunk[]) => ({
  count: chunks.length,
  top: chunks.slice(0, 10).map((c) => ({ id: c.id, score: c.score })),
});

export async function* answerQuestion(
  userId: string | null,
  question: string,
  history: Turn[],
): AsyncGenerator<PipelineEvent> {
  const turn = startObservation(
    "rag-turn",
    { input: question, metadata: { historyLength: history.length } },
    { asType: "chain" },
  );

  // Re-enters the turn's context. The userId is applied on each entry because
  // propagateAttributes only scopes a callback, and this generator resumes in
  // the consumer's context between pulls.
  const inTurn = <T>(fn: () => T): T =>
    withObservation(turn, () =>
      userId ? propagateAttributes({ userId }, fn) : fn(),
    );

  // Runs one pipeline step inside its own span so nested LLM calls attach to it.
  async function step<T>(
    name: string,
    input: unknown,
    fn: () => Promise<T>,
    describe: (result: T) => {
      output: unknown;
      metadata?: Record<string, unknown>;
    },
  ): Promise<T> {
    const span = inTurn(() => startObservation(name, { input }));
    try {
      const result = await withObservation(span, fn);
      span.update(describe(result)).end();
      return result;
    } catch (e) {
      span.update({ level: "ERROR", statusMessage: String(e) }).end();
      throw e;
    }
  }

  let answer = "";
  try {
    yield { type: "status", value: "searching" };
    // Rewrites the message into a standalone question using recent history,
    // since retrieval has no memory of prior turns.
    const condensed = await step(
      "condense",
      { question, historyLength: history.length },
      () => condenseQuery(question, history),
      (output) => ({ output }),
    );
    // Hybrid search (vector + keyword) over every readable chunk: a wide, cheap
    // net whose ranking is rough.
    const candidates = await step(
      "retrieve",
      condensed,
      () => retrieve(userId, condensed),
      (chunks) => ({ output: summarizeChunks(chunks) }),
    );
    yield { type: "retrieved", chunks: candidates };

    yield { type: "status", value: "ranking" };
    // A slower model reads the query against each candidate directly, so the
    // final order reflects relevance rather than vector distance.
    let passages: RetrievedChunk[] = [];
    let reranked = true;
    if (candidates.length > 0) {
      const rerankResult = await step(
        "rerank",
        { query: condensed, candidates: candidates.length },
        async () => {
          try {
            return {
              passages: await rerank(condensed, candidates),
              reranked: true,
            };
          } catch (e) {
            console.error(
              "[rag] rerank failed, falling back to fused order:",
              e,
            );
            return {
              passages: candidates.slice(0, ANSWER_CHUNK_LIMIT),
              reranked: false,
            };
          }
        },
        (r) => ({
          output: summarizeChunks(r.passages),
          metadata: { reranked: r.reranked },
        }),
      );
      passages = rerankResult.passages;
      reranked = rerankResult.reranked;
    }
    yield { type: "passages", chunks: passages, reranked };

    if (passages.length === 0) {
      answer = NO_CONTEXT_REPLY;
      yield { type: "text", value: NO_CONTEXT_REPLY };
      return;
    }

    yield { type: "status", value: "answering" };
    // Writes the reply grounded only in the passages, streamed so the first
    // words reach the client while the rest is generated.
    const pieces = streamAnswer(question, passages, history);
    while (true) {
      // Generator bodies run in the caller's async context, so re-enter the trace per pull.
      const next = await inTurn(() => pieces.next());
      if (next.done) break;
      answer += next.value;
      yield { type: "text", value: next.value };
    }
  } finally {
    turn.update({ output: answer }).end();
  }
}
