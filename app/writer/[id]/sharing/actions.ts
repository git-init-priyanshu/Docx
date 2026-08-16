"use server";

import type { LinkAccess } from "@prisma/client";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { resolveDocumentAccess } from "@/lib/documentAccess";

export type SharedUser = {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  isOwner: boolean;
};

export type SharingState = {
  linkAccess: LinkAccess;
  isOwner: boolean;
  people: SharedUser[];
};

const ownedDocument = async (docId: string, userId: string) =>
  prisma.document.findFirst({
    where: { id: docId, userId },
    select: { id: true },
  });

export const GetSharing = async (docId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const access = await resolveDocumentAccess(docId, session.id);
    if (!access) return { success: false, error: "Document does not exist" };

    const ownerId = access.document.userId;

    const members = await prisma.userOnDocument.findMany({
      where: { documentId: docId },
      select: {
        assignedAt: true,
        user: {
          select: { id: true, name: true, email: true, picture: true },
        },
      },
      orderBy: { assignedAt: "asc" },
    });

    // The owner is authoritative from Document.userId, not from membership —
    // a document created before the join table was populated still has one.
    const people: SharedUser[] = members.map(({ user }) => ({
      ...user,
      isOwner: user.id === ownerId,
    }));
    people.sort((a, b) => Number(b.isOwner) - Number(a.isOwner));

    const state: SharingState = {
      linkAccess: access.document.linkAccess,
      isOwner: ownerId === session.id,
      people,
    };
    return { success: true, data: state };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

// Only the owner can change who reaches the document. Collaborators must not be
// able to re-share it, or revoking access would be undoable by anyone it was
// ever leaked to.
export const SetLinkAccess = async (docId: string, linkAccess: LinkAccess) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    if (!(await ownedDocument(docId, session.id)))
      return { success: false, error: "Only the owner can change sharing" };

    await prisma.document.update({
      where: { id: docId },
      data: { linkAccess },
    });

    return { success: true, data: { linkAccess } };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

// Suggestions are deliberately narrow: prefix matches only, a minimum query
// length, and a small cap. That keeps the picker useful for someone who knows
// who they are looking for without turning it into a way to page through every
// account in the app. Owner-only for the same reason.
const SEARCH_MIN_CHARS = 2;
const SEARCH_LIMIT = 5;

export const SearchUsers = async (docId: string, query: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_CHARS)
    return { success: true, data: [] as SharedUser[] };

  try {
    if (!(await ownedDocument(docId, session.id)))
      return { success: false, error: "Only the owner can add people" };

    const members = await prisma.userOnDocument.findMany({
      where: { documentId: docId },
      select: { userId: true },
    });

    const matches = await prisma.user.findMany({
      where: {
        id: { notIn: members.map((m) => m.userId) },
        OR: [
          { email: { startsWith: trimmed, mode: "insensitive" } },
          { name: { startsWith: trimmed, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, picture: true },
      orderBy: { email: "asc" },
      take: SEARCH_LIMIT,
    });

    return {
      success: true,
      data: matches.map((user) => ({ ...user, isOwner: false })),
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const AddCollaborator = async (docId: string, email: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  const normalized = email.trim().toLowerCase();
  if (!normalized) return { success: false, error: "Enter an email address" };

  try {
    if (!(await ownedDocument(docId, session.id)))
      return { success: false, error: "Only the owner can add people" };

    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, name: true, email: true, picture: true },
    });
    if (!user)
      return { success: false, error: "No DocX account with that email" };

    const existing = await prisma.userOnDocument.findUnique({
      where: { userId_documentId: { userId: user.id, documentId: docId } },
      select: { userId: true },
    });
    if (existing)
      return { success: false, error: `${user.name} already has access` };

    await prisma.userOnDocument.create({
      data: { userId: user.id, documentId: docId },
    });

    return {
      success: true,
      data: { ...user, isOwner: false } satisfies SharedUser,
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const RemoveCollaborator = async (docId: string, userId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, userId: session.id },
      select: { userId: true },
    });
    if (!doc)
      return { success: false, error: "Only the owner can remove people" };

    if (userId === doc.userId)
      return { success: false, error: "The owner cannot be removed" };

    await prisma.userOnDocument.deleteMany({
      where: { userId, documentId: docId },
    });

    return { success: true, data: { userId } };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
