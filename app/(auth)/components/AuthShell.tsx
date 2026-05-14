"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";

import logo from "@/public/logo.svg";

/**
 * Full-bleed split layout for the new auth pages. Header (logo + theme toggle
 * + back link) and footer wrap the form on one side; an aside preview pane
 * fills the other side on lg+ screens.
 *
 * The `side` prop controls which side the form lives on so we can flip the
 * layout between sign-in (form-left) and sign-up (form-right) for visual
 * variety.
 */
export default function AuthShell({
  children,
  aside,
  side = "left",
}: {
  children: ReactNode;
  aside: ReactNode;
  side?: "left" | "right";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen flex bg-[var(--lp-paper)] text-[var(--lp-ink)]">
      <div
        className={
          "flex-1 flex flex-col " + (side === "right" ? "order-2" : "")
        }
      >
        <header className="h-16 px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt="DocX"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="font-semibold text-[20px] leading-none tracking-[-0.02em]">
              DocX
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden sm:inline text-[12.5px] text-[var(--lp-muted)] hover:text-[var(--lp-ink)] mr-2 transition-colors"
            >
              ← Back to site
            </Link>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-md border border-[var(--lp-border)] flex items-center justify-center text-[var(--lp-muted)] hover:bg-[var(--lp-paper-2)] hover:text-[var(--lp-ink)] transition-colors"
            >
              {mounted && isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        <footer className="px-6 lg:px-10 py-5 flex items-center justify-between text-[11.5px] text-[var(--lp-muted)] font-mono">
          <span>© {new Date().getFullYear()} DocX</span>
          <span className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--lp-ink)] transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-[var(--lp-ink)] transition-colors">
              Terms
            </Link>
          </span>
        </footer>
      </div>

      <aside
        className={
          "hidden lg:flex flex-1 bg-[var(--lp-paper-2)] relative overflow-hidden " +
          (side === "right"
            ? "order-1 border-r border-[var(--lp-border)]"
            : "border-l border-[var(--lp-border)]")
        }
      >
        <div className="absolute inset-0 lp-bg-dots opacity-40 pointer-events-none" />
        {aside}
      </aside>
    </div>
  );
}
