"use server"

import prisma from "@/prisma/prismaClient";
import { revalidatePath } from "next/cache";

export const DeleteDocument = async (email: string, docId: any) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return {
        success: false,
        error: "Looks like you don't have an account",
      };
    }

    const doc = await prisma.document.findFirst({ where: { id: docId } });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.delete({ where: { id: docId } })
    revalidatePath("/");

    return { success: true, data: "Document successfully deleted" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}

export const RenameDocument = async (docId: any, email: string, newName: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return {
        success: false,
        error: "Looks like you don't have an account",
      };
    }

    const doc = await prisma.document.findFirst({ where: { id: docId } });
    if (!doc) {
      return {
        success: false,
        error: "Document does not exist",
      };
    }

    await prisma.document.update({ where: { id: docId }, data: { name: newName } })
    revalidatePath("/");

    return { success: true, data: "Document successfully renamed" };
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" };
  }
}
