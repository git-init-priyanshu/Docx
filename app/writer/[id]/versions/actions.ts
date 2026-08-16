"use server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { UpdateDocData } from "../actions";
import { MAX_VERSIONS, shouldSnapshot } from "./policy";

export const CreateDocVersion = async (docId: string, data: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, users: { some: { userId: session.id } } },
    });
    if (!doc) return { success: false, error: "Document does not exist" };

    const latest = await prisma.documentVersion.findFirst({
      where: { documentId: docId },
      orderBy: { createdAt: "desc" },
    });
    if (!shouldSnapshot(latest ?? undefined, data))
      return { success: true, data: "skipped" };

    await prisma.documentVersion.create({
      data: { documentId: docId, data, createdById: session.id },
    });

    const stale = await prisma.documentVersion.findMany({
      where: { documentId: docId },
      orderBy: { createdAt: "desc" },
      skip: MAX_VERSIONS,
      select: { id: true },
    });
    if (stale.length)
      await prisma.documentVersion.deleteMany({
        where: { id: { in: stale.map((v) => v.id) } },
      });

    return { success: true, data: "Saved" };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const GetDocVersions = async (docId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, users: { some: { userId: session.id } } },
    });
    if (!doc) return { success: false, error: "Document does not exist" };

    const versions = await prisma.documentVersion.findMany({
      where: { documentId: docId },
      orderBy: { createdAt: "desc" },
      select: { id: true, data: true, createdAt: true },
    });

    return { success: true, data: versions };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};

export const RestoreDocVersion = async (docId: string, versionId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, users: { some: { userId: session.id } } },
    });
    if (!doc) return { success: false, error: "Document does not exist" };

    const version = await prisma.documentVersion.findFirst({
      where: { id: versionId, documentId: docId },
    });
    if (!version) return { success: false, error: "Version not found" };

    const res = await UpdateDocData(docId, version.data);
    if (!res.success) return res;

    return { success: true, data: version.data };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
