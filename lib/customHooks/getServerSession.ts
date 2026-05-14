import { getServerSession as nextAuthSession } from "next-auth";

import { authOptions } from "../auth";
import type { ReturnType } from "./ReturnType";

export default async function getServerSession(): Promise<ReturnType> {
  const session = await nextAuthSession(authOptions);
  const user = session?.user as any;

  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
  };
}
