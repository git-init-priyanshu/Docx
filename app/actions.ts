"use server"

import prisma from "@/prisma/prismaClient"

export const getAllDocuments = async() => {
  const docs = await prisma.document.findMany()
  return docs
}
