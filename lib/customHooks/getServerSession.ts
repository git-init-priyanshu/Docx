// @ts-nocheck
import { getServerSession as nextAuthSession } from "next-auth";

import { ReturnType } from "./useClientSession";
import { GetUserDetails } from "./action";
import { authOptions } from "../auth";

export default async function getServerSession(): Promise<ReturnType> {
  const session = await nextAuthSession(authOptions);

  if (session) return {
    id: session.user?.id,
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image
  };

  const userDetails = await GetUserDetails();
  return {
    id: userDetails?.id,
    name: userDetails?.name,
    email: userDetails?.email,
    image: userDetails?.picture,
  };

}
