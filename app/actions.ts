"use server"

import getServerSession from "@/lib/customHooks/getServerSession";
import prisma from "@/prisma/prismaClient"

export const GetAllDocs = async () => {
  try {
    const session = await getServerSession();
    if (!session.id) return {
      success: false,
      error: "User is not logged in",
    }

    const response = await prisma.document.findMany(
      {
        where: { 
          users: {
            some: {
              user: {
                id: session.id
              }
            }
          }
        },
        select: {
          id: true,
          thumbnail: true,
          name: true,
          updatedAt: true,
          createdBy: true,
          users: {
            select: {
              user: {
                select: {
                  name: true,
                  picture: true
                }
              }
            }
          },
        },
        orderBy: { updatedAt: 'desc' }
      }
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

