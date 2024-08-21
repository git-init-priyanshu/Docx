"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/prisma/prismaClient"
import getServerSession from "@/lib/customHooks/getServerSession"

export const GetDocDetails = async (id: any) => {
  const session = await getServerSession();
  if (!session.id) return {
    success: false,
    error: "User is not logged in",
  }

  try {
    const doc = await prisma.document.update({
      where: {
        id,
        users: {
          some: { userId: session.id }
        }
      },
      data: {
        users: {
          upsert: {
            where: {
              userId_documentId: {
                documentId: id,
                userId: session.id,
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

export const UpdateDocData = async (id: any, data: string) => {
  const session = await getServerSession();
  if (!session.id) return {
    success: false,
    error: "User is not logged in",
  }

  try {
    const doc = await prisma.document.findFirst({
      where: {
        id,
        users: {
          some: { userId: session.id }
        }
      }
    })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    await prisma.document.update({
      where: {
        id,
        users: {
          some: { userId: session.id }
        }
      },
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

export const UpdateThumbnail = async (
  id: any,
  thumbnail: string,
  deleteUrl: string
) => {
  try {
    const session = await getServerSession();
    if (!session.id) return {
      success: false,
      error: "User is not logged in",
    }

    const doc = await prisma.document.findFirst({
      where: {
        id,
        users: {
          some: { userId: session.id }
        }
      },
    })
    if (!doc) return {
      success: false,
      error: "Document does not exist",
    }

    // if(deleteUrl){
    //   await fetch(deleteUrl, {
    //     method: 'POST',
    //   })
    // }

    await prisma.document.update({
      where: {
        id,
        users: {
          some: { userId: session.id }
        }
      },
      data: {
        thumbnail,
        deleteUrl
      }
    })
    revalidatePath('/');

    return { success: true, data: "Internal server error" }
  } catch (e) {
    console.log(e)
    return { success: false, error: "Internal server error" }
  }
}
