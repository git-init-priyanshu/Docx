import { redirect } from "next/navigation";

import getServerSession from "@/lib/customHooks/getServerSession";
import DynamicImage from "./DynamicImage";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session?.id) redirect("/document");

  return (
    <div className="w-full h-dvh lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
      </div>
      <div className="hidden bg-muted lg:block">
        <DynamicImage />
      </div>
    </div>
  );
}
