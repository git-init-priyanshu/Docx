import { EMBEDDING_MODEL } from "../ai/models.ts";
import { embed, OpenRouterError } from "../ai/openrouter.ts";

// gemini-embedding-001 returns 3072 dimensions by default; Matryoshka
// truncation to 768 keeps nearly all of the retrieval quality at a quarter of
// the storage and index size, and 768 is what the `vector(768)` column and its
// HNSW index are built for.
export const EMBEDDING_DIMENSIONS = 768;

// Stored hashes include this, so switching model or size re-embeds everything.
export const EMBEDDING_VERSION = `${EMBEDDING_MODEL}@${EMBEDDING_DIMENSIONS}`;

const BATCH_SIZE = 50;
const MAX_ATTEMPTS = 5;

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
  const out: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const input = texts.slice(i, i + BATCH_SIZE);

    for (let attempt = 1; ; attempt++) {
      try {
        const vectors = await embed({
          model: EMBEDDING_MODEL,
          input,
          inputType: "search_document",
          dimensions: EMBEDDING_DIMENSIONS,
        });
        out.push(...vectors.map(normalize));
        break;
      } catch (error) {
        const retryable =
          error instanceof OpenRouterError &&
          (error.status === 429 || error.status >= 500);
        if (!retryable || attempt === MAX_ATTEMPTS) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 * 2 ** (attempt - 1)),
        );
      }
    }
  }

  return out;
}

// No retry: this runs while a user waits.
export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embed({
    model: EMBEDDING_MODEL,
    input: [text],
    inputType: "search_query",
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return normalize(vector);
}
