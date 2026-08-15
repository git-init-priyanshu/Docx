"use server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import type { ChatMessage, Citation } from "./types";

// Enough to restore a conversation without shipping an unbounded transcript to
// the client on every page load.
const RESTORE_MESSAGE_LIMIT = 20;

/**
 * Reopens the conversation the user was last having, so refreshing the page or
 * following a citation into a document does not lose the thread.
 */
export const GetLatestChatThread = async () => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const thread = await prisma.chatThread.findFirst({
      where: { userId: session.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (!thread) return { success: true, data: null };

    const rows = await prisma.chatMessage.findMany({
      where: { threadId: thread.id },
      orderBy: { createdAt: "desc" },
      take: RESTORE_MESSAGE_LIMIT,
      select: { role: true, content: true, citations: true },
    });

    const messages: ChatMessage[] = rows.reverse().map((row) => ({
      role: row.role === "assistant" ? "assistant" : "user",
      content: row.content,
      citations: (row.citations as Citation[] | null) ?? undefined,
    }));

    return { success: true, data: { id: thread.id, messages } };
  } catch (e) {
    console.error("[chat] restoring thread failed:", e);
    return { success: false, error: "Internal server error" };
  }
};
