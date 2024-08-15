"use server"

import getServerSession from "@/lib/customHooks/getServerSession"
import prisma from "@/prisma/prismaClient"
import { revalidatePath } from "next/cache"

export const GetDocDetails = async (id: any) => {
  const session = await getServerSession();
  if (!session.id) return {
    success: false,
    error: "User is not logged in",
  }

  try {
    const doc = await prisma.document.update({
      where: { id },
      data: {
        users: {
          upsert: {
            where: {
              userId_documentId: {
                userId: session.id,
                documentId: id,
              },
            },
            update: {},
            create: {
              user: {
                connect: {
                  id: session.id
                }
              }
            }
          },
        },
      }
    })

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
  try {
    const doc = await prisma.document.findFirst({ where: { id, userId } })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    await prisma.document.update({
      where: { id, userId },
      data: {
        data: data,
        updatedAt: new Date(),
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
    revalidatePath('/');

    return { success: true, data: "Internal server error" }
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}
