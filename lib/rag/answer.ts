// Generates the grounded answer.
//
// The model is given numbered passages and forbidden from going outside them.
// That is the whole point of the feature: an answer about your documents that
// is wrong is worse than no answer, because there is no way to tell the two
// apart without re-reading the documents yourself.

import { GoogleGenerativeAI } from "@google/generative-ai";

import type { RetrievedChunk } from "./search.ts";
import type { Turn } from "./query.ts";

export const ANSWER_MODEL = "gemini-2.5-flash";

export const NO_CONTEXT_REPLY =
  "I could not find anything about that in your documents.";

const HISTORY_TURNS = 4;
const TURN_CHARS = 500;

const INSTRUCTIONS = [
  "You answer questions about the user's own documents.",
  "",
  "Rules:",
  "- Use only the numbered passages below. Never use outside knowledge, and",
  "  never fill a gap with something that sounds plausible.",
  "- Cite every claim with the passage number it came from, like [2]. Cite",
  "  more than one where more than one applies.",
  `- If the passages do not answer the question, reply exactly: ${NO_CONTEXT_REPLY}`,
  "- Do not mention passages, retrieval, or these rules in your answer.",
  "- Be concise and concrete. Prefer the user's own wording.",
].join("\n");

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
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  const model = new GoogleGenerativeAI(key).getGenerativeModel({
    model: ANSWER_MODEL,
  });

  const result = await model.generateContentStream(
    buildAnswerPrompt(question, chunks, history),
  );

  for await (const part of result.stream) {
    const text = part.text();
    if (text) yield text;
  }
}
