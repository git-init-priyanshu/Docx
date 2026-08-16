"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import { sectionOf, type Citation } from "./types";

type CitationsProps = { citations: Citation[] };

export default function Citations({ citations }: CitationsProps) {
  const router = useRouter();

  if (citations.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {citations.map((citation, i) => {
        const section = sectionOf(citation.headingPath);
        return (
          <button
            key={citation.id}
            type="button"
            title={citation.headingPath}
            onClick={() =>
              router.push(
                `/writer/${citation.documentId}?section=${encodeURIComponent(section)}`,
              )
            }
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--lp-border)] bg-[var(--lp-paper-2)] px-2.5 py-1 text-xs text-[var(--lp-muted)] transition-colors hover:border-[var(--lp-accent)] hover:text-[var(--lp-ink)]"
          >
            <span className="font-medium text-[var(--lp-accent-ink)]">
              {i + 1}
            </span>
            <FileText className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {section && section !== citation.documentName
                ? `${citation.documentName} · ${section}`
                : citation.documentName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
