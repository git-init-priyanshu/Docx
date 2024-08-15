"use server"

import prisma from "@/prisma/prismaClient"

export const GetAllDocs = async (userId: string) => {
  try {
    const response = await prisma.document.findMany(
      {
        where: { 
          users: {
            some: {
              user: {
                id: userId
              }
            }
          }
        },
        select: {
          id: true,
          thumbnail: true,
          name: true,
          updatedAt: true,
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

