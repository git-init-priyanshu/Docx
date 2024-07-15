"use server"

import prisma from "@/prisma/prismaClient"

export const GetDocDetails = async (id: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    return { success: true, data: doc }
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
} 
