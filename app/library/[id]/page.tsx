import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/prisma/prismaClient";
import AskBar from "@/components/AskBar/AskBar";
import ArticleContent from "./ArticleContent";

type Props = {
  params: { id: string };
};

// Shared by the metadata and the page, so one request reads the article once.
const findPublicDoc = cache((id: string) =>
  prisma.document.findFirst({
    where: { id, isPublic: true },
    select: { name: true, data: true, sourceUrl: true },
  }),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await findPublicDoc(params.id);
  return doc ? { title: doc.name } : {};
}

export default async function LibraryArticlePage({ params }: Props) {
  const doc = await findPublicDoc(params.id);
  if (!doc) notFound();

  return (
    <>
      <main className="min-h-screen bg-[var(--lp-paper)] text-[var(--lp-ink)]">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">
          <Link
            href="/library"
            className="text-[13px] text-[var(--lp-muted)] hover:text-[var(--lp-ink)]"
          >
            Library
          </Link>
          <h1 className="mt-4 text-[30px] sm:text-[38px] leading-[1.1] tracking-tight font-semibold text-[var(--lp-ink)]">
            {doc.name}
          </h1>
          <p className="mt-2 mb-8 text-[12.5px] text-[var(--lp-muted)]">
            From{" "}
            <a
              href={doc.sourceUrl ?? undefined}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia
            </a>
            , licensed{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              CC BY-SA 4.0
            </a>
            . Converted for reading: images, references and infoboxes removed.
          </p>
          <ArticleContent data={doc.data} />
        </div>
      </main>
      <AskBar />
    </>
  );
}
