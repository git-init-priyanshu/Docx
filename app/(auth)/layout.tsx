import { redirect } from "next/navigation";

import getServerSession from "@/lib/customHooks/getServerSession";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session?.id) redirect("/document");

  return <>{children}</>;
}
