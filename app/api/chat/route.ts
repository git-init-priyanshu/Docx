// Streaming endpoint for document Q&A.
//
// A route handler rather than a server action: server actions cannot stream,
// and this response has four sequential stages — condense, retrieve, rerank,
// generate — the first three of which are silent. Reporting them as they
// happen is the difference between a responsive feature and a four-second
// spinner.
//
// Wire format is newline-delimited JSON, one event per line:
//   {"type":"status","value":"retrieving"}
//   {"type":"citations","value":[{ id, documentId, documentName, headingPath }]}
//   {"type":"text","value":"partial answer text"}
//   {"type":"done","threadId":"..."}
//   {"type":"error","value":"human-readable reason"}

import { NextResponse } from "next/server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { recordAiCall, AI_CALLS_PER_HOUR } from "@/lib/aiUsage";
import { retrieve, type RetrievedChunk } from "@/lib/rag/search";
import { rerank } from "@/lib/rag/rerank";
import { condenseQuery, type Turn } from "@/lib/rag/query";
import { streamAnswer, NO_CONTEXT_REPLY } from "@/lib/rag/answer";

export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = 2000;
const HISTORY_TURNS = 8;
const TITLE_CHARS = 60;

type ChatRequest = { message?: unknown; threadId?: unknown };

const citationOf = (chunk: RetrievedChunk) => ({
  id: chunk.id,
  documentId: chunk.documentId,
  documentName: chunk.documentName,
  headingPath: chunk.headingPath,
});

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session.id) {
    return NextResponse.json({ error: "User is not logged in" }, { status: 401 });
  }
  const userId = session.id;

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Ask a question" }, { status: 400 });
  }
  if (message.length > MAX_QUESTION_CHARS) {
    return NextResponse.json(
      { error: "That question is too long" },
      { status: 400 },
    );
  }

  const requestedThreadId =
    typeof body.threadId === "string" ? body.threadId : null;

  // One usage row per user question, not per model call — the three calls
  // behind a single answer are an implementation detail of this endpoint.
  const usage = await recordAiCall(userId, "chat");
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: `You have used all ${AI_CALLS_PER_HOUR} AI requests for this hour. Try again shortly.`,
      },
      { status: 429 },
    );
  }

  // Ownership check doubles as existence check: a thread belonging to someone
  // else is indistinguishable from one that does not exist.
  const thread = requestedThreadId
    ? await prisma.chatThread.findFirst({
        where: { id: requestedThreadId, userId },
        select: { id: true },
      })
    : null;

  if (requestedThreadId && !thread) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const history: Turn[] = thread
    ? (
        await prisma.chatMessage.findMany({
          where: { threadId: thread.id },
          orderBy: { createdAt: "desc" },
          take: HISTORY_TURNS,
          select: { role: true, content: true },
        })
      )
        .reverse()
        .map((row) => ({
          role: row.role === "assistant" ? "assistant" : "user",
          content: row.content,
        }))
    : [];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      try {
        send({ type: "status", value: "searching" });
        const searchQuery = await condenseQuery(message, history);

        const candidates = await retrieve(userId, searchQuery);

        send({ type: "status", value: "ranking" });
        const chunks =
          candidates.length > 0 ? await rerank(searchQuery, candidates) : [];

        send({ type: "citations", value: chunks.map(citationOf) });

        let answer = "";
        if (chunks.length === 0) {
          answer = NO_CONTEXT_REPLY;
          send({ type: "text", value: answer });
        } else {
          send({ type: "status", value: "answering" });
          for await (const piece of streamAnswer(message, chunks, history)) {
            answer += piece;
            send({ type: "text", value: piece });
          }
        }

        // Persisted after the answer completes, so a stream that dies partway
        // does not leave a truncated answer in the thread.
        const threadId =
          thread?.id ??
          (
            await prisma.chatThread.create({
              data: { userId, title: message.slice(0, TITLE_CHARS) },
              select: { id: true },
            })
          ).id;

        await prisma.chatMessage.createMany({
          data: [
            { threadId, role: "user", content: message },
            {
              threadId,
              role: "assistant",
              content: answer,
              citations: chunks.map(citationOf),
            },
          ],
        });
        await prisma.chatThread.update({
          where: { id: threadId },
          data: { updatedAt: new Date() },
        });

        send({ type: "done", threadId });
      } catch (e) {
        console.error("[chat] request failed:", e);
        send({ type: "error", value: "Something went wrong answering that." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
