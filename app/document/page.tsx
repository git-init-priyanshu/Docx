import prisma from "@/prisma/prismaClient";
import getServerSession from "@/lib/customHooks/getServerSession";
import type { DocSummary } from "@/lib/types/document";
import AskBar from "@/components/AskBar/AskBar";
import DocumentContent from "./components/DocumentContent";
import QuickStart from "./components/QuickStart";

export default async function DocumentPage() {
  const session = await getServerSession();

  let initialDocs: DocSummary[] = [];

  if (session?.id) {
    initialDocs = await prisma.document.findMany({
      where: {
        users: {
          some: { user: { id: session.id } },
        },
      },
      select: {
        id: true,
        name: true,
        preview: true,
        updatedAt: true,
        source: true,
        createdBy: { select: { id: true, name: true, picture: true } },
        users: {
          select: {
            user: {
              select: { id: true, name: true, picture: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  const initialSession = session?.id
    ? { id: session.id, name: session.name, email: session.email, image: session.image }
    : null;

  return (
    <>
      <DocumentContent
        initialDocs={initialDocs}
        initialSession={initialSession}
        quickStart={<QuickStart />}
      />
      <AskBar />
    </>
  );
}
