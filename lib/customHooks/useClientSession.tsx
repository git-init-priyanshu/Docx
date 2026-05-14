"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

import type { ReturnType } from "./ReturnType";

/**
 * Returns the current session as `{ id, name, email, image }`, or `null` while
 * NextAuth is still resolving. The object reference is stable across renders as
 * long as the underlying session doesn't change — callers can safely use it as
 * a `useEffect` dependency.
 */
export default function useClientSession(): ReturnType | null {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading") return null;
    if (!session) {
      return { id: undefined, name: undefined, email: undefined, image: undefined };
    }
    const u = session.user as any;
    return { id: u?.id, name: u?.name, email: u?.email, image: u?.image };
  }, [session, status]);
}
