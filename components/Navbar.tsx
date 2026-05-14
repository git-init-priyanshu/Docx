"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Star, Sun, Moon } from "lucide-react";
import Image from "next/image";

import logo from "@/public/logo.svg";

function DocxLogo({ width = 30 }: { width?: number }) {
  return <Image src={logo} width={width} alt="logo" />;
}

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
            <span className="font-mono">18</span>
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
