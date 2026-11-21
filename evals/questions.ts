import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Question = {
  id: string;
  question: string;
  /** Null when the corpus cannot answer the question. */
  answer: string | null;
  /** Gold is a quoted span, not a chunk id, so it survives chunking changes. */
  evidence: { documentId: string; title: string; quote: string } | null;
  split: "dev" | "test";
};

export const questionsFile = join(import.meta.dirname, "questions.jsonl");

export const questions: Question[] = readFileSync(questionsFile, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
