"use client";

import { Layers2, PenLine, Users } from "lucide-react";

import AppSidebar from "@/components/AppSidebar";

const FOLDERS = [
  { id: "all",    label: "All documents",  Icon: Layers2 },
  { id: "Drafts", label: "My documents",   Icon: PenLine },
  { id: "Shared", label: "Shared with me", Icon: Users   },
];

type SidebarProps = {
  folder: string;
  setFolder: (f: string) => void;
  onCreate: () => void;
};

export default function Sidebar({ folder, setFolder, onCreate }: SidebarProps) {
  return (
    <AppSidebar onCreate={onCreate} breakpoint="md">
      <nav className="px-3 mt-5">
        <div className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2 text-[var(--lp-muted)]">
          Folders
        </div>
        <ul className="space-y-0.5">
          {FOLDERS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => setFolder(id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition ${
                  folder === id
                    ? "bg-[color-mix(in_oklab,var(--lp-accent)_12%,var(--lp-card))] text-[var(--lp-ink)]"
                    : "bg-transparent text-[var(--lp-muted)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                <span className="flex-1 text-left">{label}</span>
                {folder === id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--lp-accent)]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </AppSidebar>
  );
}
