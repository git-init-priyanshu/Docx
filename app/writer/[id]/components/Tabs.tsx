"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, Layers } from "lucide-react";

import useClientSession from "@/lib/customHooks/useClientSession";
import { useDocs } from "@/lib/hooks/useDocs";
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

  const { docs: allDocs, isLoading: loading } = useDocs(session?.id);
  const docs = allDocs
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const filtered = docs.filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppSidebar onCreate={() => router.push("/document")} breakpoint="lg">
      {/* Search */}
      <div className="px-3 mt-4">
        <div className="relative">
          <input
            className="w-full h-9 pl-8 pr-3 rounded-md border text-[13px] outline-none"
            placeholder="Search…"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              background: "var(--lp-card)",
              borderColor: "var(--lp-border)",
              color: "var(--lp-ink)",
            }}
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--lp-muted)" }}
          />
        </div>
      </div>

      {/* Recent docs */}
      <div className="px-3 mt-5">
        <div
          className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2"
          style={{ color: "var(--lp-muted)" }}
        >
          Recent
        </div>
        {loading ? (
          <ul className="space-y-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2 px-2 py-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 animate-pulse"
                  style={{ background: "var(--lp-border)" }}
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div
                    className="h-3 rounded animate-pulse"
                    style={{ background: "var(--lp-border)", width: `${60 + (i % 3) * 15}%` }}
                  />
                  <div className="h-2 rounded animate-pulse w-10" style={{ background: "var(--lp-border)" }} />
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
                    className="flex items-start gap-2 px-2 py-1.5 rounded-md text-[13px] cursor-pointer"
                    style={{
                      background: active
                        ? "color-mix(in oklab, var(--lp-accent) 10%, var(--lp-card))"
                        : undefined,
                      color: active ? "var(--lp-ink)" : "var(--lp-muted)",
                    }}
                    onClick={() => router.push(`/writer/${doc.id}`)}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                      style={{ background: active ? "var(--lp-accent)" : "transparent" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-[13px]">{doc.name || "Untitled"}</div>
                      <div className="font-mono text-[10px]" style={{ color: "var(--lp-muted)" }}>
                        {relativeTime(doc.updatedAt)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-2 py-1.5 text-[12px]" style={{ color: "var(--lp-muted)" }}>
                {q ? "No matches" : "No documents yet"}
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Folders */}
      <div className="px-3 mt-5">
        <div
          className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2"
          style={{ color: "var(--lp-muted)" }}
        >
          Folders
        </div>
        <ul className="space-y-0.5">
          {FOLDERS.map(({ name }) => (
            <li key={name}>
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] cursor-pointer hover:bg-[var(--lp-card)]"
                style={{ color: "var(--lp-muted)" }}
                onClick={() => router.push(`/document`)}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="flex-1">{name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppSidebar>
  );
}
