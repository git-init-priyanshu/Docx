"use server"

import prisma from "@/prisma/prismaClient";

export const CreateNewDocument = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) return {
      success: false,
      error: "Looks like you don't have an account",
    };

    const doc = await prisma.document.create({
      data: {
        data: ""
        // users: [user]
      }
    })

    return { success: true, data: doc }
  } catch (e) {
    return { success: false, error: "Internal server error" }
  }
}
