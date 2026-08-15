// Embedding calls for indexing and for queries.
//
// gemini-embedding-001 returns 3072 dimensions by default; Matryoshka
// truncation to 768 keeps nearly all of the retrieval quality at a quarter of
// the storage and index size, and 768 is what the `vector(768)` column and its
// HNSW index are built for. text-embedding-004 is retired and returns 400.
//
// Documents and queries are embedded with different task types on purpose:
// asymmetric embedding measurably beats using one type for both, because a
// short question and a long passage do not live in the same part of the space.

import {
  GoogleGenerativeAI,
  TaskType,
  type EmbedContentRequest,
} from "@google/generative-ai";

// The v1beta endpoint accepts `outputDimensionality`, but @google/generative-ai
// 0.21 has not caught up in its types — it forwards the request body verbatim,
// so the field works today. Declared here rather than cast at each call site.
type SizedEmbedRequest = EmbedContentRequest & {
  outputDimensionality: number;
};

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

// The API caps a batch request; well under it, and small enough that one
// failure re-does little work.
const BATCH_SIZE = 50;

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key).getGenerativeModel({
    model: EMBEDDING_MODEL,
  });
}

// Truncated Matryoshka vectors are no longer unit length. Cosine distance does
// not care, but normalising keeps the stored vectors well-behaved for any
// future switch to inner-product search.
function normalize(values: number[]): number[] {
  const magnitude = Math.sqrt(
    values.reduce((sum, value) => sum + value * value, 0),
  );
  if (!magnitude || !Number.isFinite(magnitude)) return values;
  return values.map((value) => value / magnitude);
}

/** Postgres has no array→vector cast, so vectors travel as `[1,2,3]` text. */
export const toVectorLiteral = (values: number[]) => `[${values.join(",")}]`;

export async function embedPassages(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const model = client();
  const out: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await model.batchEmbedContents({
      requests: batch.map(
        (text): SizedEmbedRequest => ({
          content: { role: "user", parts: [{ text }] },
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          outputDimensionality: EMBEDDING_DIMENSIONS,
        }),
      ),
    });
    for (const embedding of response.embeddings) {
      out.push(normalize(embedding.values));
    }
  }

  return out;
}

export async function embedQuery(text: string): Promise<number[]> {
  const request: SizedEmbedRequest = {
    content: { role: "user", parts: [{ text }] },
    taskType: TaskType.RETRIEVAL_QUERY,
    outputDimensionality: EMBEDDING_DIMENSIONS,
  };
  const response = await client().embedContent(request);
  return normalize(response.embedding.values);
}
