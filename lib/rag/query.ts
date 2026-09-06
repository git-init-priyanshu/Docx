import { chat, isConfigured } from "@/lib/ai/openrouter";
import { CONDENSE_MODEL } from "@/lib/ai/models";

export type Turn = { role: "user" | "assistant"; content: string };

// Enough conversation to resolve a pronoun without turning into a second prompt.
const HISTORY_TURNS = 4;
const TURN_CHARS = 500;

export async function condenseQuery(
  question: string,
  history: Turn[],
): Promise<string> {
  if (history.length === 0) return question;

  if (!isConfigured()) return question;

  const recent = history.slice(-HISTORY_TURNS).map((turn) => {
    const speaker = turn.role === "user" ? "User" : "Assistant";
    return `${speaker}: ${turn.content.slice(0, TURN_CHARS)}`;
  });

  const prompt = `
    Rewrite the final user question so it can be understood without the
    conversation above. Resolve pronouns and implied subjects. Keep the
    user's own wording wherever possible, and keep any names, identifiers or
    error strings exactly as written. If it already stands alone, repeat it
    unchanged. Reply with the rewritten question and nothing else.

    ${recent.join("\n")}
    User: ${question}
  `;

  try {
    const rewritten = (
      await chat({ model: CONDENSE_MODEL, prompt, temperature: 0 })
    ).trim();
    return rewritten || question;
  } catch (e) {
    console.error("[rag] query condensation failed, using raw question:", e);
    return question;
  }
}
