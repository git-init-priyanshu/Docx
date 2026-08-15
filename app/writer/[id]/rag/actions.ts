"use server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { indexDocument } from "@/lib/rag/indexer";

/**
 * Refreshes a document's retrieval index. Called by the editor right after a
 * version snapshot is written, and deliberately not awaited by the caller —
 * embedding takes seconds and must not hold the save indicator.
 *
 * Losing this call costs nothing permanent: `Document.indexedHash` still
 * disagrees with the content, so the next snapshot or a backfill run reindexes.
 */
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
