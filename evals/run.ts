// Runs the real retrieval pipeline over the eval questions and scores
// retrieval, answers and refusals.
//
//   node --env-file=.env evals/run.ts <label> [dev|test|all]
//
// Writes evals/results/<label>.json after every question. Running a label again
// keeps its scored questions and retries the rest. The split defaults to dev.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import prisma from "../prisma/prismaClient.ts";
import {
  ANSWER_MODEL,
  CONDENSE_MODEL,
  EMBEDDING_MODEL,
  RERANK_MODEL,
} from "../lib/ai/models.ts";
import { createStableExperimentId } from "@langfuse/core";
import { propagateAttributes, startObservation } from "@langfuse/tracing";

import {
  flushLangfuse,
  langfuse,
  withObservation,
} from "../lib/ai/langfuse.ts";
import { NO_CONTEXT_REPLY } from "../lib/rag/answer.ts";
import { answerQuestion } from "../lib/rag/pipeline.ts";
import type { RetrievedChunk } from "../lib/rag/search.ts";
import { containsQuote } from "./evidence.ts";
import { judgeAnswer, type Verdict } from "./judge.ts";
import { JUDGE_MODEL } from "./models.ts";
import { questions } from "./questions.ts";

const USAGE = "node --env-file=.env evals/run.ts <label> [dev|test|all]";
const CONCURRENCY = 4;

type QuestionRecord = {
  id: string;
  split: "dev" | "test";
  question: string;
  answerable: boolean;
  reference: string | null;
  answer: string | null;
  refused: boolean | null;
  retrievedHit: boolean | null;
  passageRank: number | null;
  verdict: Verdict | null;
  error: string | null;
  timings: {
    retrieveMs: number | null;
    rerankMs: number | null;
    firstTokenMs: number | null;
    totalMs: number | null;
  } | null;
  passages: { documentId: string; headingPath: string }[];
};

const [label, split = "dev"] = process.argv.slice(2);

if (!label || !["dev", "test", "all"].includes(split)) {
  console.error(`Usage: ${USAGE}`);
  process.exit(1);
}

const selected = questions.filter((q) => split === "all" || q.split === split);
const models = {
  answer: ANSWER_MODEL,
  rerank: RERANK_MODEL,
  condense: CONDENSE_MODEL,
  embedding: EMBEDDING_MODEL,
  judge: JUDGE_MODEL,
};

const resultsDir = join(import.meta.dirname, "results");
const resultsFile = join(resultsDir, `${label}.json`);
mkdirSync(resultsDir, { recursive: true });

let records: QuestionRecord[] = [];
let createdAt = new Date().toISOString();
if (existsSync(resultsFile)) {
  const previous = JSON.parse(readFileSync(resultsFile, "utf8"));
  if (
    previous.split !== split ||
    JSON.stringify(previous.models) !== JSON.stringify(models)
  ) {
    console.error(
      `${resultsFile} holds a run with a different split or models. Use another label or delete the file.`,
    );
    process.exit(1);
  }
  records = previous.questions.filter((r: QuestionRecord) => !r.error);
  createdAt = previous.createdAt;
  console.log(`Resuming ${label}: ${records.length} already scored`);
}

const scoredIds = new Set(records.map((r) => r.id));
const pending = selected.filter((q) => !scoredIds.has(q.id));
let next = 0;
let done = 0;

function summarize(runRecords: QuestionRecord[]) {
  const share = (
    items: QuestionRecord[],
    test: (r: QuestionRecord) => boolean,
  ) =>
    items.length === 0
      ? null
      : Number((items.filter(test).length / items.length).toFixed(4));

  const percentile = (values: number[], p: number) => {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round(sorted[Math.ceil((p / 100) * sorted.length) - 1]);
  };

  const scored = runRecords.filter((r) => !r.error);
  const answerable = scored.filter((r) => r.answerable);
  const unanswerable = scored.filter((r) => !r.answerable);
  const judged = answerable.filter((r) => r.verdict);

  const meanReciprocalRank =
    answerable.reduce(
      (sum, r) => sum + (r.passageRank ? 1 / r.passageRank : 0),
      0,
    ) / answerable.length;
  const retrieveTimes = runRecords.flatMap((r) => r.timings?.retrieveMs ?? []);
  const rerankTimes = runRecords.flatMap((r) => r.timings?.rerankMs ?? []);
  const firstTokenTimes = runRecords.flatMap(
    (r) => r.timings?.firstTokenMs ?? [],
  );
  const totalTimes = runRecords.flatMap((r) => r.timings?.totalMs ?? []);

  return {
    answerable: {
      count: answerable.length,
      recallAt30: share(answerable, (r) => r.retrievedHit === true),
      recallAt8: share(answerable, (r) => r.passageRank !== null),
      mrr:
        answerable.length === 0 ? null : Number(meanReciprocalRank.toFixed(4)),
      correct: share(answerable, (r) => r.verdict?.correct === true),
      grounded: share(judged, (r) => r.verdict?.grounded === true),
      falseRefusal: share(answerable, (r) => r.refused === true),
    },
    unanswerable: {
      count: unanswerable.length,
      correctRefusal: share(unanswerable, (r) => r.refused === true),
    },
    latencyMs: {
      retrieveP50: percentile(retrieveTimes, 50),
      rerankP50: percentile(rerankTimes, 50),
      firstTokenP50: percentile(firstTokenTimes, 50),
      firstTokenP95: percentile(firstTokenTimes, 95),
      totalP50: percentile(totalTimes, 50),
      totalP95: percentile(totalTimes, 95),
    },
    errors: runRecords.length - scored.length,
  };
}

const dataset = langfuse
  ? await langfuse.dataset.get("docx-rag-questions")
  : null;
const datasetItems = new Map(dataset?.items.map((item) => [item.id, item]));

// A dataset run is an experiment whose id derives from project, dataset and
// run name. Spans that carry it are listed as that run's items.
let experimentId: string | null = null;
try {
  if (langfuse && dataset) {
    experimentId = await createStableExperimentId({
      projectId: await langfuse.getProjectId(),
      datasetId: dataset.id,
      runName: label,
    });
  }
} catch (error) {
  console.warn("Langfuse dataset run id failed:", error);
}

const worker = async () => {
  while (next < pending.length) {
    const question = pending[next++];
    const record: QuestionRecord = {
      id: question.id,
      split: question.split,
      question: question.question,
      answerable: question.evidence !== null,
      reference: question.answer,
      answer: null,
      refused: null,
      retrievedHit: null,
      passageRank: null,
      verdict: null,
      error: null,
      timings: null,
      passages: [],
    };

    const evalObs = langfuse
      ? startObservation("eval-question", {
          input: question.question,
          metadata: { questionId: question.id, split: question.split },
        })
      : null;

    try {
      const run = async () => {
        const start = performance.now();
        let retrieved: RetrievedChunk[] = [];
        let passages: RetrievedChunk[] = [];
        let answer = "";
        let retrieveMs: number | null = null;
        let rerankMs: number | null = null;
        let firstTokenMs: number | null = null;

        for await (const event of answerQuestion(null, question.question, [])) {
          const elapsed = performance.now() - start;
          if (event.type === "retrieved") {
            retrieved = event.chunks;
            retrieveMs = elapsed;
          } else if (event.type === "passages") {
            if (!event.reranked) {
              throw new Error("Rerank failed, passages are in fused order");
            }
            passages = event.chunks;
            rerankMs = elapsed - (retrieveMs ?? 0);
          } else if (event.type === "text") {
            firstTokenMs ??= elapsed;
            answer += event.value;
          }
        }
        const totalMs = performance.now() - start;

        record.answer = answer;
        record.refused = answer.trim() === NO_CONTEXT_REPLY;
        record.timings = { retrieveMs, rerankMs, firstTokenMs, totalMs };
        record.passages = passages.map((p) => ({
          documentId: p.documentId,
          headingPath: p.headingPath,
        }));

        const evidence = question.evidence;
        if (evidence) {
          const matches = (chunk: RetrievedChunk) =>
            chunk.documentId === evidence.documentId &&
            containsQuote(chunk.content, evidence.quote);
          record.retrievedHit = retrieved.some(matches);
          const index = passages.findIndex(matches);
          record.passageRank = index === -1 ? null : index + 1;
        }

        if (question.answer !== null && !record.refused) {
          record.verdict = await judgeAnswer({
            question: question.question,
            reference: question.answer,
            answer,
            passages: passages.map((p) => p.content),
          });
        }
      };
      await (evalObs
        ? withObservation(evalObs, () =>
            propagateAttributes(
              {
                sessionId: label,
                tags: [label],
                ...(experimentId &&
                  datasetItems.has(question.id) && {
                    _internalExperiment: {
                      experimentId,
                      experimentName: label,
                      experimentDatasetId: dataset?.id,
                      experimentItemId: question.id,
                      experimentItemRootObservationId: evalObs.id,
                    },
                  }),
              },
              run,
            ),
          )
        : run());
    } catch (error) {
      record.error = error instanceof Error ? error.message : String(error);
    }

    if (langfuse && evalObs) {
      evalObs.update({ output: record.answer });
      evalObs.end();
      const comment = record.error ?? undefined;
      const scores: Record<string, number | null> = {
        correct: record.verdict ? Number(record.verdict.correct) : null,
        grounded: record.verdict ? Number(record.verdict.grounded) : null,
        retrievedHit:
          record.retrievedHit === null ? null : Number(record.retrievedHit),
        passageRank: record.passageRank,
        refused: record.refused === null ? null : Number(record.refused),
        totalMs: record.timings?.totalMs ?? null,
      };
      for (const [name, value] of Object.entries(scores)) {
        if (value === null) continue;
        const verdictComment = record.verdict
          ? `correct=${record.verdict.correct} grounded=${record.verdict.grounded}`
          : comment;
        langfuse.score.trace(evalObs, { name, value, comment: verdictComment });
      }
      if (!experimentId || !datasetItems.has(question.id)) {
        console.warn(`Langfuse dataset link skipped for ${question.id}`);
      }
    }

    records.push(record);
    writeFileSync(
      resultsFile,
      JSON.stringify(
        {
          label,
          split,
          createdAt,
          models,
          summary: summarize(records),
          questions: records.toSorted((a, b) => a.id.localeCompare(b.id)),
        },
        null,
        2,
      ),
    );
    let status = "";
    if (record.error) status = "error";
    else if (record.refused) status = "refused";
    else if (record.retrievedHit === true) status = "hit";
    else if (record.retrievedHit === false) status = "miss";
    const progress = `[${++done}/${pending.length}] ${record.id}`;
    console.log(`${progress} ${status}`.trim());
  }
};

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const summary = summarize(records);
console.log(`\n${label} (${split})`);
console.table(summary.answerable);
console.table(summary.unanswerable);
console.table(summary.latencyMs);
console.log(`errors: ${summary.errors}`);

await flushLangfuse();
await prisma.$disconnect();
