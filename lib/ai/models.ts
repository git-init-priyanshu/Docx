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
//   The three RAG calls (ANSWER, RERANK, CONDENSE) run with reasoning
//   disabled: each works from text it is handed, and hidden reasoning added
//   seconds per call.
//
// - RERANK returns a JSON array of passage numbers, so it needs a model with
//   reliable schema-shaped output. Same model as WRITER for that reason.
//
// - CONDENSE blocks retrieval on every chat turn — nothing else can start until
//   it returns — so it is chosen for latency on what is a one-sentence rewrite.
//
// - EMBEDDING turns passages and questions into vectors. Stored vectors are
//   only comparable to vectors from the same model, so changing it re-embeds
//   every document on its next index (the stored hashes cover the model). The
//   output must stay at the 768 dimensions the `vector(768)` column holds.

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

export const EMBEDDING_MODEL = model(
  "OPENROUTER_EMBEDDING_MODEL",
  "google/gemini-embedding-001",
);
