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
//   {"type":"citations","value":[{ id, documentId, documentName, headingPath,
//     isPublic }]}
//   {"type":"text","value":"partial answer text"}
//   {"type":"done","threadId":"..."}   (threadId only for signed-in callers)
//   {"type":"error","value":"human-readable reason"}
//
// Guests can ask too: they search public documents only, are limited per
// visitor, and nothing of theirs is stored.

import { createHash } from "crypto";
import { NextResponse } from "next/server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import {
  recordAiCall,
  recordVisitorCall,
  AI_CALLS_PER_HOUR,
} from "@/lib/aiUsage";
import { answerQuestion } from "@/lib/rag/pipeline";
import type { RetrievedChunk } from "@/lib/rag/search";
import type { Turn } from "@/lib/rag/query";

export const dynamic = "force-dynamic";

const MAX_QUESTION_CHARS = 2000;
const HISTORY_TURNS = 8;
const TITLE_CHARS = 60;

type ChatRequest = {
  message?: unknown;
  threadId?: unknown;
  history?: unknown;
};

const citationOf = (chunk: RetrievedChunk) => ({
  id: chunk.id,
  documentId: chunk.documentId,
  documentName: chunk.documentName,
  headingPath: chunk.headingPath,
  isPublic: chunk.isPublic,
});

export async function POST(request: Request) {
  const session = await getServerSession();
  const userId = session.id ?? null;

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
    userId && typeof body.threadId === "string" ? body.threadId : null;

  if (userId) {
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
  } else {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    // Hashed so raw IP addresses are never stored.
    const visitorKey = createHash("sha256")
      .update(`${process.env.NEXTAUTH_SECRET}:${ip}`)
      .digest("hex");

    const usage = await recordVisitorCall(visitorKey, "chat");
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error:
            "The guest limit has been reached. Sign in to keep asking, or try again later.",
        },
        { status: 429 },
      );
    }
  }

  // Ownership check doubles as existence check: a thread belonging to someone
  // else is indistinguishable from one that does not exist.
  const thread =
    userId && requestedThreadId
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

  let history: Turn[] = [];
  if (thread) {
    history = (
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
      }));
  } else if (!userId && Array.isArray(body.history)) {
    history = body.history
      .filter(
        (turn) =>
          (turn?.role === "user" || turn?.role === "assistant") &&
          typeof turn.content === "string",
      )
      .map((turn) => ({
        role: turn.role,
        content: turn.content.slice(0, MAX_QUESTION_CHARS),
      }))
      .slice(-HISTORY_TURNS);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      try {
        let chunks: RetrievedChunk[] = [];
        let answer = "";
        for await (const event of answerQuestion(userId, message, history)) {
          if (event.type === "status") {
            send({ type: "status", value: event.value });
          } else if (event.type === "passages") {
            chunks = event.chunks;
            send({ type: "citations", value: chunks.map(citationOf) });
          } else if (event.type === "text") {
            answer += event.value;
            send({ type: "text", value: event.value });
          }
        }

        if (!userId) {
          send({ type: "done" });
          return;
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
