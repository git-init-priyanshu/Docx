import { getServerSession as nextAuthSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import type { ReturnType } from "./ReturnType";

export default async function getServerSession(): Promise<ReturnType> {
  const session = await nextAuthSession(authOptions);
  const user = session?.user;

  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
  };
}
