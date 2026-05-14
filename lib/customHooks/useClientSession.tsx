"use client";

import { useSession } from "next-auth/react";

import type { ReturnType } from "./ReturnType";

export default function useClientSession(): ReturnType | null {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return { id: undefined, name: undefined, email: undefined, image: undefined };

  const u = session.user as any;
  return { id: u?.id, name: u?.name, email: u?.email, image: u?.image };
}
