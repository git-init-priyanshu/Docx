"use server"

import prisma from "@/prisma/prismaClient";
import { revalidatePath } from "next/cache";

export const DeleteDocument = async (docId: any, userId: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id: docId, userId } });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.delete({ where: { id: docId, userId } })
    revalidatePath("/");

    return { success: true, data: "Document successfully deleted" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}

export const RenameDocument = async (docId: any, userId: string, newName: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id: docId, userId } });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.update({
      where: { id: docId, userId },
      data: { name: newName }
    })
    revalidatePath("/");

    return { success: true, data: "Document successfully renamed" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}
