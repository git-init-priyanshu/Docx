"use server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { indexDocument } from "@/lib/rag/indexer";

export const IndexDocument = async (docId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, users: { some: { userId: session.id } } },
      select: { id: true },
    });
    if (!doc) return { success: false, error: "Document does not exist" };

    const result = await indexDocument(docId);
    return { success: true, data: result.status };
  } catch (e) {
    console.error("[rag] indexing failed for", docId, e);
    return { success: false, error: "Internal server error" };
  }
};
