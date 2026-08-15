"use server";

import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import { ROOM_TOKEN_TTL_MS, roomForDoc } from "@/lib/room";
import { createRoomToken } from "@/lib/roomToken";

export const MintRoomToken = async (docId: string) => {
  const session = await getServerSession();
  if (!session.id) return { success: false, error: "User is not logged in" };

  const secret = process.env.WS_TOKEN_SECRET;
  if (!secret)
    return { success: false, error: "Collaboration is not configured" };

  try {
    const doc = await prisma.document.findFirst({
      where: { id: docId, users: { some: { userId: session.id } } },
      select: { id: true },
    });
    if (!doc) return { success: false, error: "Document does not exist" };

    const token = createRoomToken(
      {
        userId: session.id,
        docId,
        name: session.name ?? "",
        exp: Date.now() + ROOM_TOKEN_TTL_MS,
      },
      secret,
    );

    return { success: true, data: { token, room: roomForDoc(docId) } };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
};
