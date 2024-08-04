"use server"

import { cookies } from "next/headers";

import prisma from "@/prisma/prismaClient";
import { signOut } from "next-auth/react";

export const CreateNewDocument = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return {
        success: false,
        error: "Looks like you don't have an account",
      };
    }

    const doc = await prisma.document.create({
      data: {
        data: "",
        userId: user.id,
        users: {
          create: {
            user: {
              connect: {
                id: user.id
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
    signOut();

    return { success: true, data: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
}
