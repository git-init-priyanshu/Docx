"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Import } from "lucide-react";
import type { DocumentSource, User } from "@prisma/client";

import prettifyDate from "@/helpers/prettifyDates";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import { RenameDocument } from "./Card/actions";
import { updateGuestDocument } from "@/lib/guestServices";
import CardOptions from "./Card/components/Options";
import AvatarList from "@/components/AvatarList";
import DocThumbnail from "@/components/DocThumbnail";
import { invalidateDocs } from "@/lib/hooks/useDocs";

const DOC_COLORS = [
  "var(--lp-accent)",
  "var(--lp-leaf)",
  "var(--lp-rose)",
  "var(--lp-tan)",
];

type DocCardItemProps = {
  docId: string;
  preview: string | null;
  title: string;
  updatedAt: Date;
  source?: DocumentSource;
  createdBy: { id: string; name: string; picture: string | null };
  users: { user: Pick<User, "id" | "name" | "picture"> }[];
  view: "grid" | "list";
  colorIndex: number;
};

// Imported content was written in another editor, so a stray margin or an odd
// font is likely something the conversion did rather than something the writer
// chose. Saying where a document came from is what makes that legible.
const ImportedBadge = () => (
  <span className="inline-flex items-center gap-1 h-[18px] px-1.5 rounded font-mono uppercase tracking-wider text-[9px] shrink-0 border border-[var(--lp-border)] bg-[color-mix(in_oklab,var(--lp-accent)_10%,var(--lp-card))] text-[var(--lp-muted)]">
    <Import className="w-2.5 h-2.5" strokeWidth={2} />
    Imported
  </span>
);

export default function DocCardItem({
  docId,
  preview,
  title,
  updatedAt,
  source,
  createdBy,
  users,
  view,
  colorIndex,
}: DocCardItemProps) {
  const router = useRouter();
  const session = useClientSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(title);
  const color = DOC_COLORS[colorIndex % DOC_COLORS.length];

  const debounce = useDebounce(async () => {
    if (!inputRef.current) return;
    const trimmed = inputRef.current.value.trim();
    if (!trimmed) return;
    if (session?.id) {
      const response = await RenameDocument(docId, trimmed);
      if (!response.success) toast.error(response.error);
      await invalidateDocs(session.id);
    } else {
      updateGuestDocument(docId, "name", trimmed);
      await invalidateDocs();
    }
  }, 1000);

  // Adopt an updated title prop (rename elsewhere, duplicate, collaborator
  // change) unless the user is actively editing this input.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setName(title);
  }, [title]);

  // Flush a pending rename on unmount so it isn't lost within the 1s delay.
  useEffect(() => {
    return () => {
      debounce.flush();
    };
  }, [debounce]);

  const isImported = source === "GOOGLE_DOCS";
  const isOwner = !session?.id || createdBy.id === session.id;
  const ownerName = isOwner ? "You" : createdBy.name;
  const ownerInitial = (ownerName[0] ?? "?").toUpperCase();
  const formattedDate = prettifyDate(String(updatedAt), {
    month: "short",
    day: "2-digit",
  });

  if (view === "list") {
    return (
      <div
        className="w-full grid grid-cols-[1fr,140px,90px,32px] gap-4 items-center px-4 py-3 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] transition cursor-pointer hover:border-[var(--lp-accent)]"
        onClick={() => router.push(`/writer/${docId}`)}
      >
        {/* Name */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center text-white shrink-0"
            style={{ background: color }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 21l3.5-1 11-11L14 5.5 3 16.5 3 21z" />
            </svg>
          </span>
          <div className="min-w-0">
            <input
              ref={inputRef}
              value={name}
              className="text-[13.5px] font-medium truncate bg-transparent border-none outline-none w-full focus:bg-[var(--lp-paper-2)] focus:px-1 rounded transition text-[var(--lp-ink)]"
              onClick={e => e.stopPropagation()}
              onChange={e => { setName(e.target.value); debounce(e.target.value); }}
            />
          </div>
          {isImported && <ImportedBadge />}
        </div>

        {/* Owner */}
        <div className="flex items-center gap-1.5 text-[12px] text-[var(--lp-muted)]">
          <span className="w-5 h-5 rounded-full bg-[var(--lp-accent)] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
            {ownerInitial}
          </span>
          <span className="truncate">{ownerName}</span>
        </div>

        {/* Date */}
        <div className="font-mono text-[10.5px] text-[var(--lp-muted)]">{formattedDate}</div>

        <span onClick={e => e.stopPropagation()}>
          <CardOptions docId={docId} inputRef={inputRef} />
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] overflow-hidden transition text-left cursor-pointer group doc-fade-up hover:border-[var(--lp-accent)] doc-shadow-hover"
      onClick={() => router.push(`/writer/${docId}`)}
    >
      {/* Thumbnail area */}
      <DocThumbnail
        data={preview}
        accentColor={color}
        className="border-b border-[var(--lp-border)]"
        style={{ aspectRatio: "4/3.2" }}
      />

      {/* Card footer */}
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            value={name}
            className="text-[13px] font-medium truncate flex-1 min-w-0 bg-transparent border-none outline-none focus:bg-[var(--lp-paper-2)] focus:px-1 rounded transition text-[var(--lp-ink)]"
            onClick={e => e.stopPropagation()}
            onChange={e => { setName(e.target.value); debounce(e.target.value); }}
          />
          {isImported && <ImportedBadge />}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <AvatarList users={users} />
            <span className="text-[11px] truncate text-[var(--lp-muted)]">{ownerName}</span>
          </div>
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <span className="font-mono text-[10px] text-[var(--lp-muted)]">{formattedDate}</span>
            <CardOptions docId={docId} inputRef={inputRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
