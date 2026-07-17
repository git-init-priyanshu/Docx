"use server";

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

    const existing = await prisma.document.findUnique({
      where: {
        id,
      },
    });
    if (!existing)
      return {
        success: false,
        error: "Document does not exist",
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

// Gemini frequently wraps responses in ``` fences or prefaces them with
// "Sure, here is…". Strip those so the result can be inserted into the doc
// without polluting the user's content.
const cleanGeneratedText = (raw: string): string => {
  let text = raw.trim();

  const fenceMatch = text.match(/^```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)\n```$/);
  if (fenceMatch) text = fenceMatch[1].trim();

  text = text.replace(
    /^(?:sure[,!.]?\s*|certainly[,!.]?\s*|of course[,!.]?\s*|here(?:'s| is|\s+are)[^:.\n]*[:.]\s*)/i,
    "",
  );

  return text.trim();
};

// Cap input to keep generations responsive and stay within Gemini's quota.
const MAX_INPUT_CHARS = 20_000;

export const generateText = async (
  option: generateTextOptions,
  text: string,
  language?: string,
  customInstruction?: string,
) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: "AI is not configured on the server" };
    }
    const trimmed = (text ?? "").trim();
    if (!trimmed) {
      return { success: false, error: "Select some text to use AI" };
    }
    const input =
      trimmed.length > MAX_INPUT_CHARS
        ? trimmed.slice(0, MAX_INPUT_CHARS)
        : trimmed;

    const basePrompt = prompts.find((e) => e.option === option)?.prompt;

    let prompt: string;
    if (option === generateTextOptions.TRANSLATE) {
      if (!language) return { success: false, error: "Choose a language" };
      if (!basePrompt) return { success: false, error: "Unknown option" };
      prompt = `Target language: ${language}\n\nText:\n"""\n${input}\n"""\n\n${basePrompt}`;
    } else if (option === generateTextOptions.CUSTOM) {
      if (!customInstruction)
        return { success: false, error: "No instruction provided" };
      prompt = `Document text:\n"""\n${input}\n"""\n\nTask: ${customInstruction}`;
    } else {
      if (!basePrompt) return { success: false, error: "Unknown option" };
      prompt = `Text:\n"""\n${input}\n"""\n\n${basePrompt}`;
    }

    const note =
      "\n\nRespond with only the resulting text — no preamble, no markdown code fences, no surrounding quotes.";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt + note);
    const cleaned = cleanGeneratedText(result.response.text());

    if (!cleaned) {
      return { success: false, error: "AI returned an empty response" };
    }
    return { success: true, data: cleaned };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
