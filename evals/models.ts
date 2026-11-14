// Kept apart from lib/ai/models.ts: these models grade the app, they are not
// part of it. Neither should be the model that writes the answers.
export const QUESTION_MODEL =
  process.env.EVAL_QUESTION_MODEL?.trim() || "qwen/qwen3.8-flash";

export const JUDGE_MODEL =
  process.env.EVAL_JUDGE_MODEL?.trim() || "qwen/qwen3.8-flash";
