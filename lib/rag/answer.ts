import { streamChat } from "@/lib/ai/openrouter";
import { ANSWER_MODEL } from "@/lib/ai/models";

import type { RetrievedChunk } from "./search.ts";
import type { Turn } from "./query.ts";

export const NO_CONTEXT_REPLY =
  "I could not find anything about that in your documents.";

const HISTORY_TURNS = 4;
const TURN_CHARS = 500;

const INSTRUCTIONS = `
  You answer questions about the user's own documents.

  Rules:
  - Use only the numbered passages below. Never use outside knowledge, and
    never fill a gap with something that sounds plausible.
  - Cite every claim with the passage number it came from, like [2]. Cite
    more than one where more than one applies.
  - If the passages do not answer the question, reply exactly: ${NO_CONTEXT_REPLY}
  - Do not mention passages, retrieval, or these rules in your answer.
  - Be concise and concrete. Prefer the user's own wording.
`;

const renderPassages = (chunks: RetrievedChunk[]) =>
  chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] ${chunk.documentName} — ${chunk.headingPath}\n${chunk.content}`,
    )
    .join("\n\n");

const renderHistory = (history: Turn[]) =>
  history
    .slice(-HISTORY_TURNS)
    .map(
      (turn) =>
        `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content.slice(0, TURN_CHARS)}`,
    )
    .join("\n");

export function buildAnswerPrompt(
  question: string,
  chunks: RetrievedChunk[],
  history: Turn[],
): string {
  const sections = [INSTRUCTIONS, "", "Passages:", renderPassages(chunks)];

  if (history.length > 0) {
    sections.push("", "Conversation so far:", renderHistory(history));
  }

  sections.push("", `Question: ${question}`);
  return sections.join("\n");
}

export async function* streamAnswer(
  question: string,
  chunks: RetrievedChunk[],
  history: Turn[],
): AsyncGenerator<string> {
  yield* streamChat({
    model: ANSWER_MODEL,
    prompt: buildAnswerPrompt(question, chunks, history),
  });
}
