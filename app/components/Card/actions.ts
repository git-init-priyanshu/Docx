"use server"

import { revalidatePath } from "next/cache";

import getServerSession from "@/lib/customHooks/getServerSession";
import prisma from "@/prisma/prismaClient";

export const DeleteDocument = async (docId: any) => {
  try {
    const session = await getServerSession();
    if (!session.id) return {
      success: false,
      error: "User is not logged in",
    }

    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        userId: session.id
      }
    });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.delete({
      where: {
        id: docId,
        userId: session.id
      }
    })
    revalidatePath("/");

    return { success: true, data: "Document successfully deleted" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}

export const RenameDocument = async (docId: any, newName: string) => {
  try {
    const session = await getServerSession();
    if (!session.id) return {
      success: false,
      error: "User is not logged in",
    }

    const doc = await prisma.document.findFirst({
      where: {
        id: docId,
        userId: session.id
      }
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
        userId: session.id
      },
      data: { name: newName }
    })
    revalidatePath("/");

    return { success: true, data: "Document successfully renamed" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}
