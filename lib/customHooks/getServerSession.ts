import { getServerSession as nextAuthSession } from "next-auth";

import { authOptions } from "../auth";
import { GetUserDetails } from "./action";
import type { ReturnType } from "./ReturnType";

export default async function getServerSession(): Promise<ReturnType> {
  const session = await nextAuthSession(authOptions);

  if (session) {
    const user = session.user as any;
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
    };
  }

  const userDetails = await GetUserDetails();
  return {
    id: userDetails?.id,
    name: userDetails?.name,
    email: userDetails?.email,
    image: userDetails?.picture,
  };
}
