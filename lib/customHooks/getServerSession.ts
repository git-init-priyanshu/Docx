// @ts-nocheck
import { getServerSession as nextAuthSession } from "next-auth";

import { ReturnType } from "./useClientSession";
import { GetUserDetails } from "./action";

export default async function getServerSession(): Promise<ReturnType> {
  const session = await nextAuthSession();

  if (session) return {
    id: "",
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image
  };

  console.log("........................here...............................................")
  const userDetails = await GetUserDetails();
  return {
    id: userDetails?.id,
    name: userDetails?.name,
    email: userDetails?.email,
    image: userDetails?.picture,
  };

}
