// Generates the evaluation questions into evals/questions.jsonl: answerable
// ones from sampled public chunks, unanswerable ones from the article titles.
//
//   node --env-file=.env evals/generateQuestions.ts <answerable> <unanswerable>

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import prisma from "../prisma/prismaClient.ts";
import { chat } from "../lib/ai/openrouter.ts";
import { QUESTION_MODEL } from "./models.ts";
import { containsQuote } from "./evidence.ts";
import type { Question } from "./questions.ts";

const answerable = Number(process.argv[2]);
const unanswerable = Number(process.argv[3]);

if (
  !Number.isInteger(answerable) ||
  answerable < 1 ||
  !Number.isInteger(unanswerable) ||
  unanswerable < 1
) {
  console.error(
    "Usage: node --env-file=.env evals/generateQuestions.ts " +
      "<answerable> <unanswerable>",
  );
  process.exitCode = 1;
  process.exit();
}

type SourceChunk = {
  id: string;
  documentId: string;
  title: string;
  headingPath: string;
  content: string;
};

const chunks = await prisma.$queryRaw<SourceChunk[]>`
  SELECT * FROM (
    SELECT DISTINCT ON (c."documentId")
           c.id, c."documentId", d.name AS title, c."headingPath", c.content
    FROM "DocumentChunk" c
    JOIN "Document" d ON d.id = c."documentId"
    WHERE d."isPublic" AND c.embedding IS NOT NULL
      AND length(c.content) BETWEEN 600 AND 2400
    ORDER BY c."documentId", md5(c.id)
  ) picked
  ORDER BY md5(picked.id)
  LIMIT ${answerable}
`;

const generated: Question[] = [];
const drops = new Map<string, number>();
const drop = (reason: string) =>
  drops.set(reason, (drops.get(reason) ?? 0) + 1);

let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < chunks.length) {
      const chunk = chunks[next++];
      const prompt = `You write evaluation questions for a search system over an encyclopedia.

Article: ${chunk.title}
Section: ${chunk.headingPath}
Passage:
${chunk.content}

Write one question that this passage answers.
- It must stand alone: name its subject explicitly, and never refer to "the passage", "the article", "the text" or "this section".
- Ask about a specific fact stated in the passage, the way a curious reader would phrase it. Do not copy the passage's wording.
- It must have one clear answer that the passage states directly.

Reply with JSON only:
{"question": "...", "answer": "a short, complete answer", "quote": "the exact sentence or phrase from the passage that states the answer, copied verbatim, at most 200 characters"}`;

      let reply: string;
      try {
        reply = await chat({
          model: QUESTION_MODEL,
          json: true,
          temperature: 0.7,
          prompt,
        });
      } catch {
        drop("model call failed");
        continue;
      }

      let question: unknown;
      let answer: unknown;
      let quote: unknown;
      try {
        ({ question, answer, quote } = JSON.parse(reply));
      } catch {
        drop("invalid JSON");
        continue;
      }

      if (
        typeof question !== "string" ||
        typeof answer !== "string" ||
        typeof quote !== "string" ||
        !question.trim() ||
        !answer.trim() ||
        !quote.trim()
      ) {
        drop("missing field");
      } else if (quote.length > 200) {
        drop("quote too long");
      } else if (!containsQuote(chunk.content, quote)) {
        drop("quote not in passage");
      } else if (/\b(passage|article|text|section)\b/i.test(question)) {
        drop("question refers to the source");
      } else {
        generated.push({
          id: "",
          question: question.trim(),
          answer: answer.trim(),
          evidence: {
            documentId: chunk.documentId,
            title: chunk.title,
            quote: quote.trim(),
          },
          split: "dev",
        });
      }
    }
  }),
);

const answerableKept = generated.length;

const documents = await prisma.document.findMany({
  where: { isPublic: true },
  select: { name: true },
});

const unanswerableReply = await chat({
  model: QUESTION_MODEL,
  json: true,
  temperature: 0.7,
  prompt: `An encyclopedia contains exactly these articles:
${documents.map((document) => document.name).join("; ")}

Write ${unanswerable} questions that a reader might plausibly ask this encyclopedia but that it cannot answer.
- Half must be about real subjects from the list above, asking for a trivial detail that no encyclopedia records: for example a shoe size, a street address, the colour of a specific door, what someone ate on a particular day, or an exact count nobody has published.
- Half must be about specific people, places, products or organisations that do not exist. Give them ordinary, believable names and write the question exactly as if the subject were real.
- Never use words such as invented, fictional, imaginary, made-up, hypothetical, minor or obscure.
- Each question must name its subject explicitly and read like a normal factual question.

Reply with JSON only: {"questions": ["...", "..."]}`,
});

const givesItAway = /\b(invented|fictional|imaginary|made-up|hypothetical)\b/i;
const unanswerableQuestions: string[] = [];
for (const question of JSON.parse(unanswerableReply).questions.filter(
  (q: unknown) => typeof q === "string" && q.trim(),
)) {
  if (givesItAway.test(question)) {
    drop("unanswerable question says its subject is not real");
    continue;
  }
  unanswerableQuestions.push(question.trim());
  generated.push({
    id: "",
    question: question.trim(),
    answer: null,
    evidence: null,
    split: "dev",
  });
}

const byId = new Map<string, Question>();
for (const entry of generated) {
  const id = createHash("sha256")
    .update(entry.question)
    .digest("hex")
    .slice(0, 12);
  if (byId.has(id)) continue;
  byId.set(id, {
    ...entry,
    id,
    split: parseInt(id.slice(0, 2), 16) < 77 ? "test" : "dev",
  });
}

const output = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(
  join(import.meta.dirname, "questions.jsonl"),
  output.map((entry) => JSON.stringify(entry)).join("\n") + "\n",
);

console.log(`Answerable kept: ${answerableKept}`);
for (const [reason, count] of drops) {
  console.log(`  dropped, ${reason}: ${count}`);
}
console.log(`Unanswerable kept: ${unanswerableQuestions.length}`);
console.log(
  `Written ${output.length}: ` +
    `${output.filter((entry) => entry.split === "dev").length} dev, ` +
    `${output.filter((entry) => entry.split === "test").length} test`,
);

await prisma.$disconnect();
