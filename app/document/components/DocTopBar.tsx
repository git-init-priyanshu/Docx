"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, X, LogIn } from "lucide-react";
import Image from "next/image";

import prettifyDate from "@/helpers/prettifyDates";
import useClientSession from "@/lib/customHooks/useClientSession";
import useDebounce from "@/lib/customHooks/useDebounce";
import doc from "@/public/output-onlinepngtools.svg";
import { SearchDocAction } from "./Header/actions";

type SearchResult = {
  id: string;
  name: string;
  updatedAt: Date;
  createdBy: { name: string };
};

type DocTopBarProps = {
  q: string;
  setQ: (q: string) => void;
};

export default function DocTopBar({ q, setQ }: DocTopBarProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const session = useClientSession();
  const searchRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<{
    success: boolean;
    data?: SearchResult[];
    error?: string;
  } | undefined>(undefined);

  const debounce = useDebounce(async (value: string) => {
    if (!value || !session?.id) return;
    setIsSearching(true);
    const resp = await SearchDocAction(value);
    setSearchResponse(resp as any);
    setIsSearching(false);
  }, 500);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isFocused && !!searchResponse && !!session?.id;

  return (
    <div className="h-[52px] border-b border-[var(--lp-border)] bg-[var(--lp-card)] flex items-center px-6 gap-3 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-[480px]" ref={searchRef}>
        <input
          value={q}
          onChange={e => {
            setQ(e.target.value);
            if (!e.target.value) {
              setSearchResponse(undefined);
              return;
            }
            debounce(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search documents…"
          className="w-full h-9 pl-10 pr-10 rounded-md text-[13.5px] outline-none transition bg-[var(--lp-paper-2)] border border-[var(--lp-border)] text-[var(--lp-ink)]"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[var(--lp-muted)]" />
        {q && (
          <button
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            onClick={() => { setQ(""); setSearchResponse(undefined); }}
          >
            <X className="w-4 h-4 text-[var(--lp-muted)]" />
          </button>
        )}

        {/* Search dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 rounded-b-xl border border-t-0 overflow-hidden shadow-lg bg-[var(--lp-card)] border-[var(--lp-border)]">
            {isSearching ? (
              <div className="p-3 text-center text-[13px] text-[var(--lp-muted)]">
                Searching…
              </div>
            ) : !searchResponse?.success ? (
              <div className="p-3 text-center text-[13px] text-[var(--lp-muted)]">
                {searchResponse?.error}
              </div>
            ) : (
              searchResponse.data?.map(d => (
                <div
                  key={d.id}
                  onClick={() => router.push(`/writer/${d.id}`)}
                  className="flex cursor-pointer justify-between p-2.5 border-l-2 border-l-transparent hover:bg-[var(--lp-paper-2)] transition"
                >
                  <div className="flex gap-2 items-center">
                    <Image className="w-5" src={doc} alt="doc" height={20} />
                    <div>
                      <p className="text-[13px] text-[var(--lp-ink)]">{d.name}</p>
                      <p className="text-[11px] text-[var(--lp-muted)]">{d.createdBy.name}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-[var(--lp-muted)]">
                    {prettifyDate(String(d.updatedAt), { month: "short", day: "2-digit" })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-md border border-[var(--lp-border)] flex items-center justify-center transition hover:bg-[var(--lp-paper-2)]"
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-4 h-4 text-[var(--lp-ink)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--lp-ink)]" />
          )}
        </button>
        {!session?.id && (
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-white text-[13px] font-medium transition hover:opacity-90 bg-[var(--lp-accent)]"
          >
            <LogIn className="w-3.5 h-3.5" strokeWidth={2} />
            Login
          </button>
        )}
      </div>
    </div>
  );
}
