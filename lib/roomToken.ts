// Signed room tokens for the Yjs WebSocket server.
//
// Shared by Next (which mints them, where the session and Prisma live) and the
// standalone socket server (which only verifies them). Keeping both sides on
// this one module is why the socket process needs no database access: the
// membership check happens once, at mint time, and the signature carries it.
//
// Imported by a plain `node` process as well as by Next, so it must stay free
// of framework imports and of TypeScript syntax that needs more than type
// stripping (no enums, no decorators, no namespaces).
//
// Server-only: `node:crypto` cannot be bundled for the browser. Anything the
// client also needs lives in lib/room.ts instead.

import { createHmac, timingSafeEqual } from "node:crypto";

export type RoomTokenPayload = {
  userId: string;
  docId: string;
  name: string;
  exp: number;
};

const signBody = (body: string, secret: string) =>
  createHmac("sha256", secret).update(body).digest("base64url");

export const createRoomToken = (
  payload: RoomTokenPayload,
  secret: string,
): string => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${signBody(body, secret)}`;
};

export const verifyRoomToken = (
  token: string | undefined | null,
  secret: string,
  now: number = Date.now(),
): RoomTokenPayload | null => {
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const body = token.slice(0, separator);
  const expected = signBody(body, secret);
  const provided = token.slice(separator + 1);

  // timingSafeEqual throws on a length mismatch, so compare lengths first.
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(provided), Buffer.from(expected)))
    return null;

  let payload: RoomTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload?.docId !== "string" || typeof payload?.userId !== "string")
    return null;
  if (typeof payload.exp !== "number" || payload.exp <= now) return null;

  return payload;
};
