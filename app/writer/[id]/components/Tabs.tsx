"use client";

import { useRouter } from "next/navigation";
import { Search, PenLine, Layers } from "lucide-react";

function DocxLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-label="DocX">
      <rect x="6" y="4" width="42" height="56" rx="6" fill="var(--lp-paper-2)" stroke="var(--lp-border)" strokeWidth="1.5" />
      <path d="M14 18h22M14 26h26M14 34h20M14 42h24" stroke="var(--lp-muted)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="46" r="11" fill="var(--lp-accent)" />
      <path d="M46 46l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const RECENT_DOCS = [
  { title: "Current document", time: "now", active: true },
  { title: "todo for next weekend", time: "2h ago" },
  { title: "blog draft (untitled)", time: "yesterday" },
  { title: "meeting notes", time: "2d ago" },
  { title: "random thoughts", time: "5d ago" },
];

const FOLDERS = [
  { name: "Drafts", count: 12 },
  { name: "Published", count: 28 },
  { name: "Shared with me", count: 4 },
  { name: "Archive", count: 71 },
];

export default function LeftSidebar({ name }: { name?: string }) {
  const router = useRouter();

  const docs = name
    ? [{ title: name, time: "now", active: true }, ...RECENT_DOCS.slice(1)]
    : RECENT_DOCS;

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
        <ul className="space-y-0.5">
          {docs.map((doc, i) => (
            <li key={i}>
              <div
                className="flex items-start gap-2 px-2 py-1.5 rounded-md text-[13px] cursor-pointer"
                style={{
                  background: doc.active
                    ? "color-mix(in oklab, var(--lp-accent) 10%, var(--lp-card))"
                    : undefined,
                  color: doc.active ? "var(--lp-ink)" : "var(--lp-muted)",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                  style={{ background: doc.active ? "var(--lp-accent)" : "transparent" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-[13px]">{doc.title}</div>
                  <div className="font-mono text-[10px]" style={{ color: "var(--lp-muted)" }}>{doc.time}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--lp-card)]"
        >
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
