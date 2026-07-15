"use server";

import getServerSession from "@/lib/customHooks/getServerSession";
import prisma from "@/prisma/prismaClient";

export const GetAllDocs = async (userId: string) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    const documents = await prisma.document.findMany({
      where: {
        users: {
          some: {
            user: {
              id: session.id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        data: true,
        updatedAt: true,
        createdBy: { select: { id: true, name: true, picture: true } },
        users: {
          select: {
            user: {
              select: {
                name: true,
                picture: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!documents)
      return {
        success: false,
        error: "There is some problem fetching documents.",
      };

    return { success: true, data: documents };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
