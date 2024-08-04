"use server"

import prisma from "@/prisma/prismaClient"

export const GetAllDocs = async () => {
  return await prisma.document.findMany({ orderBy: { updatedAt: 'desc' } });
}

