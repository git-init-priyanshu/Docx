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
    return NextResponse.json(
      { error: "User is not logged in" },
      { status: 401 },
    );
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

  // Records this user's usage limit and reports whether they have
  // gone over the hourly limit.
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
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
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
        // Retrieval sees the raw message with no memory of prior turns.
        // This rewrites the message into a standalone question using recent
        // history, so retrieval below has something real to search on.
        const condensedQuery = await condenseQuery(message, history);

        // Casts a wide, cheap net: hybrid search (vector similarity + keyword
        // match) over all of the user's document chunks, fused into one
        // ranked list. Fast enough to run over the whole corpus, but the
        // ranking itself is rough — refined by rerank below.
        const retrievedChunks = await retrieve(userId, condensedQuery);

        send({ type: "status", value: "ranking" });
        // Retrieval's ranking is cheap but rough, as it does not have any deep
        // understanding of the actual question — it's just vector distance and
        // keyword rank fused together over thousands of chunks. Rerank runs a
        // slower model that reads the real query text against each of these
        // few candidates directly, so the final order actually reflects relevance.
        const chunks =
          retrievedChunks.length > 0
            ? await rerank(condensedQuery, retrievedChunks)
            : [];

        send({ type: "citations", value: chunks.map(citationOf) });

        let answer = "";
        if (chunks.length === 0) {
          answer = NO_CONTEXT_REPLY;
          send({ type: "text", value: answer });
        } else {
          send({ type: "status", value: "answering" });
          // Rerank returns ranked passages, not an answer — raw document text the
          // user would still have to read and stitch together. This last model call
          // reads those passages and writes the actual reply, grounded only in them
          // and cited back to the passage each claim came from. Streamed token by
          // token so the first words reach the client while the rest is generated.
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
