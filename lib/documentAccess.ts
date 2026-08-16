import type { Document } from "@prisma/client";

import prisma from "@/prisma/prismaClient";

// A user may open a document either because they are already a collaborator on
// it, or because the owner turned on link access. Both the document read and
// the collaboration token mint have to agree on that rule, so it lives here
// rather than being spelled out at each call site.

export type DocumentAccess = {
  document: Document;
  isMember: boolean;
};

export const resolveDocumentAccess = async (
  docId: string,
  userId: string,
): Promise<DocumentAccess | null> => {
  const found = await prisma.document.findUnique({
    where: { id: docId },
    include: { users: { where: { userId }, select: { userId: true } } },
  });
  if (!found) return null;

  const { users, ...document } = found;
  const isMember = users.length > 0;

  if (!isMember && document.linkAccess === "NONE") return null;

  return { document, isMember };
};

// Opening a link-shared document makes the caller a collaborator, which is what
// puts it on their dashboard and their avatar in the header. Membership granted
// this way outlives the link: revoking link access does not remove people who
// already joined, so removing someone stays an explicit action.
export const joinViaLink = async (docId: string, userId: string) => {
  await prisma.userOnDocument.upsert({
    where: { userId_documentId: { userId, documentId: docId } },
    create: { userId, documentId: docId },
    update: {},
  });
};
