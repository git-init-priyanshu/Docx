import { chat } from "../lib/ai/openrouter.ts";
import { JUDGE_MODEL } from "./models.ts";

export type Verdict = { correct: boolean; grounded: boolean };

export async function judgeAnswer(input: {
  question: string;
  reference: string;
  answer: string;
  passages: string[];
}): Promise<Verdict> {
  const passages = input.passages
    .map((text, i) => `[${i + 1}] ${text}`)
    .join("\n\n");

  const reply = await chat({
    model: JUDGE_MODEL,
    json: true,
    temperature: 0,
    prompt: `You grade an answer produced by a search assistant.

Question: ${input.question}
Reference answer: ${input.reference}

Assistant's answer: ${input.answer}

Passages the assistant was given:
${passages}

Decide two things independently.
- correct: the assistant's answer states the same fact as the reference answer. Extra correct detail is fine. A different, contradictory, partial or missing fact is not.
- grounded: every factual claim in the assistant's answer is supported by the passages. Ignore citation markers like [1].

Reply with JSON only: {"correct": true or false, "grounded": true or false}`,
  });

  let parsed: { correct?: unknown; grounded?: unknown } | null = null;
  try {
    parsed = JSON.parse(reply);
  } catch {
    // Reported below together with the unusable reply.
  }

  if (
    typeof parsed?.correct !== "boolean" ||
    typeof parsed?.grounded !== "boolean"
  ) {
    throw new Error(`Unusable judge reply: ${reply.slice(0, 200)}`);
  }
  return { correct: parsed.correct, grounded: parsed.grounded };
}
