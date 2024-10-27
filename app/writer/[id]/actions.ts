"use server";

import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import {
  generateTextOptions,
  prompts,
} from "./components/BubbleMenuComp/generateTextConfig";

export const GetDocDetails = async (id: any) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    const doc = await prisma.document.update({
      where: {
        id,
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
                  id: session.id,
                },
              },
            },
          },
        },
      },
    });
    if (!doc)
      return {
        success: false,
        error: "Document does not exist",
      };

    return { success: true, data: doc };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const UpdateDocData = async (id: any, data: string) => {
  const session = await getServerSession();
  if (!session.id)
    return {
      success: false,
      error: "User is not logged in",
    };

  try {
    const doc = await prisma.document.findFirst({
      where: {
        id,
        users: {
          some: { userId: session.id },
        },
      },
    });
    if (!doc)
      return {
        success: false,
        error: "Document does not exist",
      };

    await prisma.document.update({
      where: {
        id,
        users: {
          some: { userId: session.id },
        },
      },
      data: {
        data: data,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: "Saved" };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const UpdateThumbnail = async (id: any, thumbnail: string) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    console.log(process.env.BACKEND_SERVER_URL);
    const response = await fetch(
      `${process.env.BACKEND_SERVER_URL}/push-to-quque`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docId: id,
          thumbnail,
          userId: session.id,
        }),
      },
    );
    revalidatePath("/");

    return await response.json();
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const generateText = async (
  option: generateTextOptions,
  text: string,
  language?: string,
) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt: string;
    if (option === generateTextOptions.TRANSLATE) {
      if (!language) return { success: false, error: "Undefined prompt" };
      prompt = `Here is the text: ${text} and language: ${language}. ${prompts.find((e) => e.option === option)?.prompt}`;
    } else {
      prompt = `Here is the text: "${text}". ${prompts.find((e) => e.option === option)?.prompt}`;
    }
    if (!prompt) return { success: false, error: "Undefined prompt" };

    const note = "Note: Provide only the required text.";
    const result = await model.generateContent(prompt + note);

    return { success: true, data: result.response.text() };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
