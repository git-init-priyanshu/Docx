"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { GetUserDetails } from "./action";
import type { ReturnType } from "./ReturnType";

export default function useClientSession(): ReturnType | null {
  const [user, setUser] = useState<ReturnType | null>(null);
  const [resolved, setResolved] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      const u = session.user as any;
      setUser({ id: u?.id, name: u?.name, email: u?.email, image: u?.image });
      setResolved(true);
      return;
    }

    // NextAuth has no session — check custom JWT cookie
    (async () => {
      const userDetails = await GetUserDetails();
      setUser({
        id: userDetails?.id,
        name: userDetails?.name,
        email: userDetails?.email,
        image: userDetails?.picture,
      });
      setResolved(true);
    })();
  }, [session, status]);

  if (!resolved) return null;
  return user;
}
