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
    cookies().delete('token');
    cookies().delete('next-auth.session-token');
    // signOut();
    console.log("here");

    return { success: true, data: null };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
}
