// Rewrites a follow-up into a question that can stand on its own.
//
// Retrieval sees one string, with no memory of the conversation. "And what
// about the other one?" embeds to nothing useful and matches no keywords, so
// without this step every follow-up in a thread retrieves garbage and the
// answer quietly degrades.
//
// Only runs when a thread already has history, so single-shot questions pay
// nothing for it.

import { GoogleGenerativeAI } from "@google/generative-ai";

export const CONDENSE_MODEL = "gemini-2.5-flash";

export type Turn = { role: "user" | "assistant"; content: string };

// Enough conversation to resolve a pronoun without turning into a second prompt.
const HISTORY_TURNS = 4;
const TURN_CHARS = 500;

export async function condenseQuery(
  question: string,
  history: Turn[],
): Promise<string> {
  if (history.length === 0) return question;

  const key = process.env.GEMINI_API_KEY;
  if (!key) return question;

  const recent = history.slice(-HISTORY_TURNS).map((turn) => {
    const speaker = turn.role === "user" ? "User" : "Assistant";
    return `${speaker}: ${turn.content.slice(0, TURN_CHARS)}`;
  });

  const prompt = [
    "Rewrite the final user question so it can be understood without the",
    "conversation above. Resolve pronouns and implied subjects. Keep the",
    "user's own wording wherever possible, and keep any names, identifiers or",
    "error strings exactly as written. If it already stands alone, repeat it",
    "unchanged. Reply with the rewritten question and nothing else.",
    "",
    ...recent,
    `User: ${question}`,
  ].join("\n");

  try {
    const model = new GoogleGenerativeAI(key).getGenerativeModel({
      model: CONDENSE_MODEL,
    });
    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();
    return rewritten || question;
  } catch (e) {
    console.error("[rag] query condensation failed, using raw question:", e);
    return question;
  }
}
