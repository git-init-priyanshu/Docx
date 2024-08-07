// @ts-nocheck
"use client"

import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"

import { GetUserDetails } from './action';

export type ReturnType = {
  id: string | null | undefined,
  name: string | null | undefined,
  email: string | null | undefined,
  image: string | null | undefined
}
export default function useClientSession(): ReturnType {
  const [user, setUser] = useState<ReturnType | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (!session) {
        const userDetails = await GetUserDetails();
        setUser({
          id: userDetails?.id,
          name: userDetails?.name,
          email: userDetails?.email,
          image: userDetails?.picture,
        });
      };
    })();
  }, [session])

  if (session) return {
    id: "",
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image
  };
  console.log("Credentials")

  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
  };
}
