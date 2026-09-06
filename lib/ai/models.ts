// Which model runs which task.
//
// Each task names its own model so that the one visible enough to deserve a
// stronger model can have one without dragging the cheap, high-frequency calls
// up with it. All of them are environment variables: swapping a model is a
// deploy setting, not a code change.
//
// Why these defaults:
//
// - WRITER runs the editor rewrites — improve, fix grammar, translate,
//   summarise. This is the most visible prose the app produces and the text
//   lands directly in the user's document, so it gets the better writer of the
//   two cheap models, and one strong at languages other than English.
//
// - ANSWER only has to restate passages it was handed and cite them, which is a
//   far easier job than writing from nothing. It also streams more output
//   tokens than any other call, so output price dominates: the cheapest capable
//   model wins here, not the best one.
//
// - RERANK returns a JSON array of passage numbers, so it needs a model with
//   reliable schema-shaped output. Same model as WRITER for that reason.
//
// - CONDENSE blocks retrieval on every chat turn — nothing else can start until
//   it returns — so it is chosen for latency on what is a one-sentence rewrite.
//
// Embeddings are deliberately absent: OpenRouter exposes no embeddings
// endpoint, so lib/rag/embed.ts still calls Google directly.

const model = (variable: string, fallback: string) =>
  process.env[variable]?.trim() || fallback;

export const WRITER_MODEL = model(
  "OPENROUTER_WRITER_MODEL",
  "qwen/qwen3.8-flash",
);

export const ANSWER_MODEL = model(
  "OPENROUTER_ANSWER_MODEL",
  "deepseek/deepseek-v4-flash-0731",
);

export const RERANK_MODEL = model(
  "OPENROUTER_RERANK_MODEL",
  "qwen/qwen3.8-flash",
);

export const CONDENSE_MODEL = model(
  "OPENROUTER_CONDENSE_MODEL",
  "deepseek/deepseek-v4-flash-0731",
);
