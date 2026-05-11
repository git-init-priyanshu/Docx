// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { GetUserDetails } from "./action";
import { ReturnType } from "./ReturnType";

export default function useClientSession(): ReturnType | null {
  const [user, setUser] = useState<ReturnType | null>(null);
  const [customLoading, setCustomLoading] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session === null) {
      setCustomLoading(true);
      (async () => {
        const userDetails = await GetUserDetails();
        setUser({
          id: userDetails?.id,
          name: userDetails?.name,
          email: userDetails?.email,
          image: userDetails?.picture,
        });
        setCustomLoading(false);
      })();
    }
  }, [session]);

  // Still waiting for NextAuth or custom auth to resolve — signal "loading"
  if (status === "loading" || customLoading) return null;

  if (session)
    return {
      id: session.user?.id,
      name: session.user?.name,
      email: session.user?.email,
      image: session.user?.image,
    };

  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
  };
}
