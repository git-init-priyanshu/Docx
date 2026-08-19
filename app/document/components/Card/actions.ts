"use server";

import { revalidatePath } from "next/cache";

import getServerSession from "@/lib/customHooks/getServerSession";
import prisma from "@/prisma/prismaClient";

/**
 * Copies a document the caller can already open.
 *
 * The body is read and written entirely here. Duplicating used to send the
 * source document down to the browser with the dashboard listing and post it
 * back, which meant every listing carried every document's full text just in
 * case someone pressed duplicate.
 */
export const DuplicateDocument = async (docId: string) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return { success: false, error: "User is not logged in" };

    const source = await prisma.document.findFirst({
      where: {
        id: docId,
        users: { some: { userId: session.id } },
      },
      select: { name: true, data: true, preview: true, source: true },
    });
    if (!source) return { success: false, error: "Document does not exist" };

    const copy = await prisma.document.create({
      data: {
        name: `${source.name} (copy)`,
        data: source.data,
        preview: source.preview,
        source: source.source,
        userId: session.id,
        users: { create: { user: { connect: { id: session.id } } } },
      },
    });
    revalidatePath("/");

    return { success: true, data: copy };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
};

export const DeleteDocument = async (docId: any) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        users: { some: { userId: session.id } },
      },
    });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    if (doc.userId === session.id) {
      await prisma.document.delete({
        where: {
          id: docId,
        },
      });
      revalidatePath("/");

      return { success: true, data: "Document successfully deleted" };
    }

    await prisma.userOnDocument.delete({
      where: {
        userId_documentId: {
          userId: session.id,
          documentId: docId,
        },
      },
    });
    revalidatePath("/");

    return { success: true, data: "Removed from your documents" };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const RenameDocument = async (docId: any, newName: string) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    const trimmed = newName.trim();
    if (!trimmed) {
      return {
        success: false,
        error: "Name cannot be empty",
      };
    }

    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        users: { some: { userId: session.id } },
      },
    });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.update({
      where: {
        id: docId,
        users: { some: { userId: session.id } },
      },
      data: { name: trimmed },
    });
    revalidatePath("/");

    return { success: true, data: "Document successfully renamed" };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
