"use server"

import prisma from "@/prisma/prismaClient"

export const GetDocDetails = async (id: any, userId: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id, userId } })
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

export const UpdateDocData = async (id: any, userId: string, data: string) => {
  console.log("here3")
  try {
    const doc = await prisma.document.findFirst({ where: { id, userId } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

  console.log("here4")
    await prisma.document.update(
      {
        where: { id, userId },
        data: {
          data: data,
          updatedAt: Date(),
        }
      })

    return { success: true, data: "Saved" }
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}

export const UpdateThumbnail = async (id: any, userId: string, thumbnail: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id, userId } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    await prisma.document.update({ where: { id, userId }, data: { thumbnail } })

    return { success: true, data: "Internal server error" }
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}
