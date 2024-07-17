"use server"

import prisma from "@/prisma/prismaClient"

export const GetDocDetails = async (id: any) => {
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

export const UpdateDocData = async (id: any, data: string) => {
  try {
    const doc = await prisma.document.findFirst({ where: { id } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    await prisma.document.update({ where: { id }, data: { data: data } })

    return { success: true, data: "Saved"}
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}

export const UpdateThumbnail = async (id: any, thumbnail: string) => {
  console.log(thumbnail)
  try {
    const doc = await prisma.document.findFirst({ where: { id } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    await prisma.document.update({ where: { id }, data: { thumbnail } })
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}
