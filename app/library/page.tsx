import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/prisma/prismaClient";
import AskBar from "@/components/AskBar/AskBar";

export const metadata: Metadata = { title: "Library" };

const PAGE_SIZE = 60;

type Props = {
  searchParams: { q?: string; page?: string };
};

export default async function LibraryPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? "";
  const requestedPage = Math.floor(Number(searchParams.page));
  const page = requestedPage >= 1 ? requestedPage : 1;

  const where = {
    isPublic: true,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [docs, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { name: "asc" },
      select: { id: true, name: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.document.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(target));
    return `/library?${params.toString()}`;
  };

  return (
    <>
      <main className="min-h-screen bg-[var(--lp-paper)] text-[var(--lp-ink)]">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 py-8">
          <h1 className="text-[30px] sm:text-[38px] leading-[1.05] tracking-tight font-semibold text-[var(--lp-ink)]">
            Library
          </h1>
          <p className="text-[14px] mt-2 text-[var(--lp-muted)]">
            {q
              ? `${total} articles matching "${q}"`
              : `${total} Wikipedia articles anyone can read and ask about.`}
          </p>

          <form method="get" className="mt-6 flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              className="h-9 w-full max-w-sm rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] px-3 text-[14px] text-[var(--lp-ink)] outline-none"
            />
            <button
              type="submit"
              className="h-9 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] px-4 text-[14px] text-[var(--lp-ink)]"
            >
              Search
            </button>
          </form>

          {docs.length === 0 ? (
            <p className="mt-8 text-[14px] text-[var(--lp-muted)]">
              No articles match that search.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {docs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/library/${doc.id}`}
                  className="rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] px-4 py-3 text-[14px] text-[var(--lp-ink)]"
                >
                  {doc.name}
                </Link>
              ))}
            </div>
          )}

          <nav className="mt-8 flex items-center justify-center gap-4 text-[14px] text-[var(--lp-ink)]">
            {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
            <span className="text-[var(--lp-muted)]">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && <Link href={pageHref(page + 1)}>Next</Link>}
          </nav>

          <p className="mt-10 text-[12.5px] text-[var(--lp-muted)]">
            Text from{" "}
            <a
              href="https://www.wikipedia.org"
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
            .
          </p>
        </div>
      </main>
      <AskBar />
    </>
  );
}
