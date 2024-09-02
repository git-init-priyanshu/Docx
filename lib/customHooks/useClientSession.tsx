// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { GetUserDetails } from "./action";
import { ReturnType } from "./ReturnType";

export default function useClientSession(): ReturnType {
  const [user, setUser] = useState<ReturnType | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session === null) {
        const userDetails = await GetUserDetails();
        setUser({
          id: userDetails?.id,
          name: userDetails?.name,
          email: userDetails?.email,
          image: userDetails?.picture,
        });
      }
    })();
  }, [session]);

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
