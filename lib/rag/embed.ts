import {
  GoogleGenerativeAI,
  TaskType,
  type EmbedContentRequest,
} from "@google/generative-ai";

type SizedEmbedRequest = EmbedContentRequest & {
  outputDimensionality: number;
};

// gemini-embedding-001 returns 3072 dimensions by default; Matryoshka
// truncation to 768 keeps nearly all of the retrieval quality at a quarter of
// the storage and index size, and 768 is what the `vector(768)` column and its
// HNSW index are built for.
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

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
