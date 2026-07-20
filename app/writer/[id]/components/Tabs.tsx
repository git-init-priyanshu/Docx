"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Search, Layers } from "lucide-react";

import useClientSession from "@/lib/customHooks/useClientSession";
import { useDocs } from "@/lib/hooks/useDocs";
import { CreateNewDocument } from "@/app/document/components/Header/actions";
import { createGuestDocument } from "@/lib/guestServices";
import AppSidebar from "@/components/AppSidebar";

function relativeTime(date: Date | string): string {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const FOLDERS = [
  { name: "Drafts" },
  { name: "Published" },
  { name: "Shared with me" },
  { name: "Archive" },
];

export default function LeftSidebar() {
  const router = useRouter();
  const params = useParams();
  const session = useClientSession();
  const currentId = params.id as string;

  const [q, setQ] = useState("");

  const { docs: allDocs, isLoading: loading } = useDocs(session === null ? null : session?.id);
  const docs = allDocs
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const filtered = docs.filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase()));

  const createDocument = async () => {
    if (session?.id) {
      const response = await CreateNewDocument();
      if (response.success) {
        toast.success("Successfully created new document");
        router.push(`/writer/${response.data?.id}`);
      } else {
        toast.error(response.error);
      }
    } else {
      const doc = createGuestDocument();
      toast.success("Successfully created new document");
      router.push(`/writer/${doc.id}`);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createDocument();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <AppSidebar onCreate={createDocument} breakpoint="lg">
      {/* Search */}
      <div className="px-3 mt-4">
        <div className="relative">
          <input
            className="w-full h-9 pl-8 pr-3 rounded-md border border-[var(--lp-border)] bg-[var(--lp-card)] text-[var(--lp-ink)] text-[13px] outline-none"
            placeholder="Search…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lp-muted)]" />
        </div>
      </div>

      {/* Recent docs */}
      <div className="px-3 mt-5">
        <div className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2 text-[var(--lp-muted)]">
          Recent
        </div>
        {loading ? (
          <ul className="space-y-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2 px-2 py-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 animate-pulse bg-[var(--lp-border)]" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div
                    className="h-3 rounded animate-pulse bg-[var(--lp-border)]"
                    style={{ width: `${60 + (i % 3) * 15}%` }}
                  />
                  <div className="h-2 rounded animate-pulse w-10 bg-[var(--lp-border)]" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map(doc => {
              const active = doc.id === currentId;
              return (
                <li key={doc.id}>
                  <div
                    className={`flex items-start gap-2 px-2 py-1.5 rounded-md text-[13px] cursor-pointer ${
                      active
                        ? "bg-[color-mix(in_oklab,var(--lp-accent)_10%,var(--lp-card))] text-[var(--lp-ink)]"
                        : "text-[var(--lp-muted)]"
                    }`}
                    onClick={() => router.push(`/writer/${doc.id}`)}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                        active ? "bg-[var(--lp-accent)]" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-[13px]">{doc.name || "Untitled"}</div>
                      <div className="font-mono text-[10px] text-[var(--lp-muted)]">
                        {relativeTime(doc.updatedAt)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-2 py-1.5 text-[12px] text-[var(--lp-muted)]">
                {q ? "No matches" : "No documents yet"}
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Folders */}
      {/* <div className="px-3 mt-5">
        <div className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2 text-[var(--lp-muted)]">
          Folders
        </div>
        <ul className="space-y-0.5">
          {FOLDERS.map(({ name }) => (
            <li key={name}>
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-[var(--lp-muted)] cursor-pointer hover:bg-[var(--lp-card)]"
                onClick={() => router.push(`/document`)}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="flex-1">{name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </AppSidebar>
  );
}
