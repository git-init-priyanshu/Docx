"use server"

import { cookies } from "next/headers";

import prisma from "@/prisma/prismaClient";
import { signOut } from "next-auth/react";

export const CreateNewDocument = async (userId: string) => {
  try {
    const doc = await prisma.document.create({
      data: {
        data: "",
        userId,
        users: {
          create: {
            user: {
              connect: {
                id: userId
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
    console.log("here1")
    cookies().delete('token');
    console.log("here2")
    cookies().delete('next-auth.session-token');
    console.log("here3")
    signOut();
    console.log("here4")

    return { success: true, data: null };
  } catch (e) {
    console.log("here5")
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
}
