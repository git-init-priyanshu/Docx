// Uploads evals/questions.jsonl to the Langfuse dataset "docx-rag-questions".
// Question ids are the item ids, so re-running updates items in place.
//
//   node --env-file=.env evals/uploadDataset.ts

import { LangfuseAPIError } from "@langfuse/core";

import { flushLangfuse, langfuse } from "../lib/ai/langfuse.ts";
import { questions } from "./questions.ts";

const DATASET_NAME = "docx-rag-questions";

if (!langfuse) {
  console.error(
    "Langfuse is not configured: set LANGFUSE_PUBLIC_KEY and " +
      "LANGFUSE_SECRET_KEY (and LANGFUSE_BASE_URL for non-default regions).",
  );
  process.exitCode = 1;
  process.exit();
}

await langfuse.api.datasets.create({
  name: DATASET_NAME,
  description: "Public-library RAG evaluation questions",
});

// The v6 API client throws a LangfuseAPIError with statusCode and the parsed
// body on HTTP errors, after its own two short retries. A 429 body carries
// details.retryAfterSeconds.
for (const [index, entry] of questions.entries()) {
  while (true) {
    try {
      await langfuse.api.datasetItems.create({
        datasetName: DATASET_NAME,
        id: entry.id,
        input: entry.question,
        expectedOutput: entry.answer,
        metadata: {
          split: entry.split,
          answerable: entry.answer !== null,
          documentId: entry.evidence?.documentId ?? null,
        },
      });
      break;
    } catch (error) {
      if (!(error instanceof LangfuseAPIError) || error.statusCode !== 429) {
        throw error;
      }
      const body = error.body as
        { details?: { retryAfterSeconds?: number } } | undefined;
      const retryAfterSeconds = body?.details?.retryAfterSeconds ?? 60;
      console.log(
        `rate limited, waiting ${retryAfterSeconds}s (${index}/${questions.length})`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, retryAfterSeconds * 1000),
      );
    }
  }
}

await flushLangfuse();

const uploadedIds = new Set(
  (await langfuse.dataset.get(DATASET_NAME)).items.map((item) => item.id),
);
const missing = questions.filter((entry) => !uploadedIds.has(entry.id));
if (missing.length > 0) {
  console.error(
    `Missing ${missing.length}/${questions.length} items in dataset "${DATASET_NAME}"`,
  );
  process.exitCode = 1;
  process.exit();
}

console.log(
  `Uploaded ${questions.length} items to dataset "${DATASET_NAME}": ` +
    `${questions.filter((entry) => entry.split === "dev").length} dev, ` +
    `${questions.filter((entry) => entry.split === "test").length} test`,
);
