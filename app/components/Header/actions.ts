"use server"

import { cookies } from "next/headers";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";

export const SearchDocAction = async (value: string) => {
  const session = await getServerSession();
  if (!session.id) return {
    success: false,
    error: "User is not logged in",
  }

  try {
    const searchResult = await prisma.document.findMany({
      where: {
        name: {
          contains: value,
          mode: 'insensitive'
        },
        userId: session.id,
      },
      select: {
        id: true,
        updatedAt: true,
        name: true,
        users: true
      }
    });

    if (searchResult.length > 0) return { success: true, data: searchResult };
    return { success: false, error: "Couldn't find document" };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Couldn't find document" };
  }
}

export const CreateNewDocument = async () => {
  try {
    const session = await getServerSession();
    if (!session.id) return {
      success: false,
      error: "User is not logged in",
    }

    const doc = await prisma.document.create({
      data: {
        data: "",
        // createdBy: session.id,
        userId: session.id,
        users: {
          create: {
            user: {
              connect: {
                id: session.id
              }
            }
          },
        },
      }
    });

    return { success: true, data: doc };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
}

export const LogoutAction = async () => {
  try {
    cookies().delete('token');
    cookies().delete('next-auth.session-token');

    return { success: true, data: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
}
