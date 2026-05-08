"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Star, Sun, Moon } from "lucide-react";
import Image from "next/image";

import logo from "@/public/logo.svg";

function DocxLogo({ className = "h-6 w-6" }: { className?: string }) {
  // return (
  //   <svg className={className} viewBox="0 0 64 64" fill="none" aria-label="DocX">
  //     <rect x="6" y="4" width="42" height="56" rx="6" fill="var(--lp-paper-2)" stroke="var(--lp-border)" strokeWidth="1.5" />
  //     <path d="M14 18h22M14 26h26M14 34h20M14 42h24" stroke="var(--lp-muted)" strokeWidth="1.6" strokeLinecap="round" />
  //     <circle cx="50" cy="46" r="11" fill="var(--lp-accent)" />
  //     <path d="M46 46l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  //   </svg>
  // );
  return <Image src={logo} width={45} alt="logo" />;
}

const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.7-.23.7-.5v-1.7c-2.92.63-3.54-1.4-3.54-1.4-.48-1.2-1.17-1.53-1.17-1.53-.96-.66.07-.65.07-.65 1.06.07 1.62 1.1 1.62 1.1.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.66-1.41-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .89-.28 2.9 1.08a10.04 10.04 0 0 1 5.27 0c2-1.36 2.89-1.08 2.89-1.08.58 1.45.21 2.52.1 2.79.67.74 1.08 1.68 1.08 2.83 0 4.04-2.45 4.93-4.79 5.19.38.33.71.97.71 1.96v2.91c0 .28.18.61.71.5A10.5 10.5 0 0 0 12 1.5z" />
  </svg>
);

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "color-mix(in oklab, var(--lp-paper) 85%, transparent)",
        borderBottomColor: "var(--lp-border)",
      }}
    >
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8 flex items-center justify-between h-[58px]">
        <Link href="/" className="flex items-center gap-2">
          <DocxLogo />
          <span
            className="font-semibold text-[19px] tracking-[-0.02em]"
            style={{ color: "var(--lp-ink)" }}
          >
            DocX
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 text-[13.5px]"
          style={{ color: "var(--lp-muted)" }}
        >
          <Link
            href="#features"
            className="hover:text-[var(--lp-ink)] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="hover:text-[var(--lp-ink)] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/document"
            className="hover:text-[var(--lp-ink)] transition-colors"
          >
            Editor
          </Link>
          <Link
            href="https://github.com/git-init-priyanshu/Docx"
            className="hover:text-[var(--lp-ink)] transition-colors"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/git-init-priyanshu/Docx"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-[12.5px] transition-colors"
            style={{
              borderColor: "var(--lp-border)",
              color: "var(--lp-muted)",
            }}
          >
            <Star className="w-3.5 h-3.5" />
            <span className="font-mono">17</span>
          </Link>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="h-8 w-8 rounded-md border flex items-center justify-center transition-colors hover:bg-[var(--lp-paper-2)]"
            style={{
              borderColor: "var(--lp-border)",
              color: "var(--lp-muted)",
            }}
            aria-label="Toggle theme"
          >
            {mounted ? (
              isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Link
            href="/document"
            className="inline-flex items-center h-8 px-3.5 rounded-md text-[12.5px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
          >
            Try it
          </Link>
        </div>
      </div>
    </header>
  );
}
