"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";

function DocxLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-label="DocX">
      <rect x="6" y="4" width="42" height="56" rx="6" fill="var(--lp-paper-2)" stroke="var(--lp-border)" strokeWidth="1.5" />
      <path d="M14 18h22M14 26h26M14 34h20M14 42h24" stroke="var(--lp-muted)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="46" r="11" fill="var(--lp-accent)" />
      <path d="M46 46l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ToolbarProps = {
  name: string;
  isSaving: boolean;
  onAsk: () => void;
};

export default function Toolbar({ name, isSaving, onAsk }: ToolbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="h-[52px] border-b border-[var(--lp-border)] bg-[var(--lp-card)] flex items-center px-4 gap-3 shrink-0">
      {/* Logo — only shows on mobile (sidebar hides on mobile) */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        <DocxLogo />
        <span className="font-semibold text-[16px] tracking-[-0.02em] text-[var(--lp-ink)]">DocX</span>
      </div>

      {/* Breadcrumb — desktop */}
      <div className="hidden lg:flex items-center gap-1.5 text-[12.5px] min-w-0">
        <span className="text-[var(--lp-muted)]">Drafts</span>
        <span className="text-[var(--lp-muted)]">/</span>
        {name ? (
          <span className="font-medium truncate max-w-[320px] text-[var(--lp-ink)]">{name}</span>
        ) : (
          <span className="w-40 h-4 rounded animate-pulse inline-block bg-[var(--lp-paper-2)]" />
        )}
      </div>

      {/* Save status */}
      <span className="hidden lg:block font-mono text-[10.5px] shrink-0 text-[var(--lp-muted)]">
        {isSaving ? "· saving…" : "· saved"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {/* Collab avatar */}
        <div className="hidden sm:flex -space-x-1.5">
          <span className="w-7 h-7 rounded-full bg-[var(--lp-accent)] text-white text-[11px] font-semibold flex items-center justify-center outline-2 outline-[var(--lp-card)] -outline-offset-1">
            P
          </span>
        </div>

        {/* Ask DocX ⌘K */}
        <button
          onClick={onAsk}
          className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[var(--lp-border)] text-[12.5px] font-medium text-[var(--lp-ink)] transition-colors hover:bg-[var(--lp-border)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--lp-accent)]" />
          <span>Ask DocX</span>
          <span className="font-mono text-[10px] ml-1 text-[var(--lp-muted)]">⌘K</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="h-8 w-8 rounded-md border border-[var(--lp-border)] text-[var(--lp-ink)] flex items-center justify-center transition-colors hover:bg-[var(--lp-border)]"
          aria-label="Toggle theme"
        >
          {mounted ? (isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <Moon className="w-4 h-4" />}
        </button>

        {/* Share */}
        <button className="h-8 px-3 rounded-md text-[12.5px] font-medium transition-opacity hover:opacity-80 bg-[var(--lp-ink)] text-[var(--lp-paper)]">
          Share
        </button>
      </div>
    </div>
  );
}
