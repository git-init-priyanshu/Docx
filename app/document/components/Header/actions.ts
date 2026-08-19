"use server";

import type { DocumentSource } from "@prisma/client";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";

export const SearchDocAction = async (value: string) => {
  const session = await getServerSession();
  if (!session.id)
    return {
      success: false,
      error: "User is not logged in",
    };

  try {
    const searchResult = await prisma.document.findMany({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
        users: {
          some: {
            user: {
              id: session?.id,
            },
          },
        },
      },
      select: {
        id: true,
        updatedAt: true,
        createdBy: {
          select: { name: true },
        },
        name: true,
        // users: true
      },
    });

    if (searchResult.length > 0) return { success: true, data: searchResult };
    return { success: false, error: "Couldn't find document" };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Couldn't find document" };
  }
};

// `id` lets a caller decide the document's id before it exists, which an import
// needs: its images are stored under that id, and they are copied out of Google
// before anything is written, so the id has to be known first.
type CreateDocumentOptions = {
  id?: string;
  source?: DocumentSource;
};

export const CreateNewDocument = async (
  initialData?: string,
  name?: string,
  options?: CreateDocumentOptions,
) => {
  try {
    const session = await getServerSession();
    if (!session.id)
      return {
        success: false,
        error: "User is not logged in",
      };

    const doc = await prisma.document.create({
      data: {
        data: initialData ?? "",
        // Left unset when absent so the schema default applies.
        ...(name?.trim() ? { name: name.trim() } : {}),
        ...(options?.id ? { id: options.id } : {}),
        ...(options?.source ? { source: options.source } : {}),
        userId: session.id,
        users: {
          create: {
            user: {
              connect: {
                id: session.id,
              },
            },
          },
        },
      },
    });

    return { success: true, data: doc };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Internal server error" };
  }
};
