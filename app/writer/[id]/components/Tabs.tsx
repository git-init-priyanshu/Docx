"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, PenLine, Layers } from "lucide-react";

import useClientSession from "@/lib/customHooks/useClientSession";
import { useDocs } from "@/lib/hooks/useDocs";
import Image from "next/image";

import logo from "@/public/logo.svg";

function DocxLogo({ width = 30 }: { width?: number }) {
  return <Image src={logo} width={width} alt="logo" />;
}

const FOLDERS = [
  { name: "Drafts", count: 12 },
  { name: "Published", count: 28 },
  { name: "Shared with me", count: 4 },
  { name: "Archive", count: 71 },
];

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

type Doc = { id: string; name: string; updatedAt: Date | string };

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

  const filtered = docs.filter(d =>
    !q || d.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <aside
      className="w-[260px] border-r hidden lg:flex flex-col shrink-0"
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      {/* Logo row */}
      <div
        className="px-4 h-[52px] flex items-center gap-2.5 border-b shrink-0"
        style={{ borderColor: "var(--lp-border)" }}
      >
        <DocxLogo className="h-6 w-6" />
        <span className="font-semibold text-[18px] tracking-[-0.02em]" style={{ color: "var(--lp-ink)" }}>
          DocX
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--lp-muted)" }}>
          v2.4
        </span>
      </div>

      {/* Actions */}
      <div className="px-3 pt-3">
        <button
          onClick={() => router.push("/document")}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-md text-[13px] font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
        >
          <PenLine className="w-4 h-4 shrink-0" />
          New document
        </button>

        <div className="mt-3 relative">
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
                <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 animate-pulse" style={{ background: "var(--lp-border)" }} />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-3 rounded animate-pulse" style={{ background: "var(--lp-border)", width: `${60 + (i % 3) * 15}%` }} />
                  <div className="h-2 rounded animate-pulse w-10" style={{ background: "var(--lp-border)" }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((doc) => {
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
          {FOLDERS.map(({ name, count }) => (
            <li key={name}>
              <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] cursor-pointer hover:bg-[var(--lp-card)]"
                style={{ color: "var(--lp-muted)" }}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="flex-1">{name}</span>
                <span className="font-mono text-[10px]">{count}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User profile */}
      <div className="mt-auto px-3 py-3 border-t" style={{ borderColor: "var(--lp-border)" }}>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--lp-card)]">
          <span
            className="w-7 h-7 rounded-full text-white text-[11px] font-semibold flex items-center justify-center shrink-0"
            style={{ background: "var(--lp-accent)" }}
          >
            P
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-medium truncate" style={{ color: "var(--lp-ink)" }}>
              Priyanshu B.
            </div>
            <div className="font-mono text-[10px] truncate" style={{ color: "var(--lp-muted)" }}>
              bartwalpriyanshu00@gmail.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
