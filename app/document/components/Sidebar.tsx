"use client";

import Image from "next/image";
import { Layers2, PenLine, Users, Star, Lock, History, Plus } from "lucide-react";

import logo from "@/public/logo.svg";
import getInitials from "@/helpers/getInitials";
import useClientSession from "@/lib/customHooks/useClientSession";

const FOLDERS = [
  { id: "all",      label: "All documents",  Icon: Layers2  },
  { id: "Drafts",   label: "Drafts",          Icon: PenLine  },
  { id: "Shared",   label: "Shared with me",  Icon: Users    },
  { id: "Starred",  label: "Starred",         Icon: Star     },
  { id: "Personal", label: "Personal",        Icon: Lock     },
  { id: "Archive",  label: "Archive",         Icon: History  },
];

type SidebarProps = {
  folder: string;
  setFolder: (f: string) => void;
  onCreate: () => void;
};

export default function Sidebar({ folder, setFolder, onCreate }: SidebarProps) {
  const session = useClientSession();
  const initial = session?.name ? getInitials(session.name) : "G";

  return (
    <aside
      className="hidden md:flex w-[260px] shrink-0 border-r flex-col h-full"
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      {/* Logo */}
      <div
        className="px-5 h-[64px] flex items-center gap-2.5 border-b shrink-0"
        style={{ borderColor: "var(--lp-border)" }}
      >
        <a href="/" className="flex items-center gap-2.5">
          <Image src={logo} alt="DocX" width={28} height={28} />
          <span
            className="text-[19px] font-semibold tracking-tight"
            style={{ color: "var(--lp-ink)" }}
          >
            DocX
          </span>
        </a>
      </div>

      {/* New button */}
      <div className="px-3 pt-4 shrink-0">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-2 h-10 px-3 rounded-md text-[13px] font-medium transition hover:opacity-90"
          style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          New document
          <span className="ml-auto font-mono text-[10px] opacity-70">⌘N</span>
        </button>
      </div>

      {/* Folder nav */}
      <nav className="px-3 mt-5 flex-1 overflow-y-auto">
        <div
          className="font-mono uppercase tracking-[0.18em] text-[10px] px-2 mb-2"
          style={{ color: "var(--lp-muted)" }}
        >
          Folders
        </div>
        <ul className="space-y-0.5">
          {FOLDERS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => setFolder(id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition"
                style={{
                  background:
                    folder === id
                      ? "color-mix(in oklab, var(--lp-accent) 12%, var(--lp-card))"
                      : "transparent",
                  color: folder === id ? "var(--lp-ink)" : "var(--lp-muted)",
                }}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
                <span className="flex-1 text-left">{label}</span>
                {folder === id && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--lp-accent)" }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile */}
      <div
        className="mt-auto px-3 py-3 border-t shrink-0"
        style={{ borderColor: "var(--lp-border)" }}
      >
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--lp-card)] transition">
          <span
            className="w-7 h-7 rounded-full text-white text-[11px] font-semibold flex items-center justify-center shrink-0"
            style={{ background: "var(--lp-accent)" }}
          >
            {initial}
          </span>
          <div className="flex-1 min-w-0">
            <div
              className="text-[12.5px] font-medium truncate"
              style={{ color: "var(--lp-ink)" }}
            >
              {session?.name ?? "Guest"}
            </div>
            <div
              className="font-mono text-[10px] truncate"
              style={{ color: "var(--lp-muted)" }}
            >
              {session?.email ?? "guest@docx.app"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
