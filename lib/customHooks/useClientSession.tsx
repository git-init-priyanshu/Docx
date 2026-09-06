"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

import type { ReturnType } from "./ReturnType";

export default function useClientSession(): ReturnType | null {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading") return null;
    if (!session) {
      return {
        id: undefined,
        name: undefined,
        email: undefined,
        image: undefined,
      };
    }

    const user = session.user as any;
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
    };
  }, [session, status]);
}
