"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TYPED_TARGET = "and somehow it actually works.";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.52.1.7-.23.7-.5v-1.7c-2.92.63-3.54-1.4-3.54-1.4-.48-1.2-1.17-1.53-1.17-1.53-.96-.66.07-.65.07-.65 1.06.07 1.62 1.1 1.62 1.1.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.66-1.41-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .89-.28 2.9 1.08a10.04 10.04 0 0 1 5.27 0c2-1.36 2.89-1.08 2.89-1.08.58 1.45.21 2.52.1 2.79.67.74 1.08 1.68 1.08 2.83 0 4.04-2.45 4.93-4.79 5.19.38.33.71.97.71 1.96v2.91c0 .28.18.61.71.5A10.5 10.5 0 0 0 12 1.5z" />
    </svg>
  );
}

function MiniDoc() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(TYPED_TARGET.slice(0, i));
      if (i >= TYPED_TARGET.length) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-[10px] border w-full max-w-[480px] overflow-hidden lp-doc-shadow"
      style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
    >
      {/* Chrome */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b" style={{ borderColor: "var(--lp-border)" }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E36F5C]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5C25A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7BB47A]" />
          <span className="ml-2.5 font-mono text-[11px]" style={{ color: "var(--lp-muted)" }}>readme.docx</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-5 h-5 rounded-full text-white text-[9px] font-semibold flex items-center justify-center ring-2 ring-[var(--lp-card)]"
            style={{ background: "var(--lp-accent)" }}
          >P</span>
          <span
            className="w-5 h-5 rounded-full text-white text-[9px] font-semibold flex items-center justify-center -ml-1.5 ring-2 ring-[var(--lp-card)]"
            style={{ background: "var(--lp-leaf)" }}
          >M</span>
        </div>
      </div>

      {/* Doc body */}
      <div className="px-6 py-5 relative" style={{ background: "var(--lp-paper-2)" }}>
        <div className="font-semibold text-[22px] leading-tight mb-0.5 tracking-[-0.025em]" style={{ color: "var(--lp-ink)" }}>
          DocX — a quick note
        </div>
        <div className="font-mono text-[10px] mb-3" style={{ color: "var(--lp-muted)" }}>draft · saved</div>
        <p className="text-[13px] leading-[1.7]" style={{ color: "var(--lp-ink)" }}>
          This is a small project I&apos;ve been hacking on for a while. It&apos;s basically
          a Google Docs clone with a few AI commands —{" "}
          {typed}<span className="lp-caret" style={{ color: "var(--lp-accent)" }}>▎</span>
        </p>

        {/* AI suggestion */}
        <div
          className="lp-float-in mt-3 inline-flex items-start gap-2 rounded-md border px-2.5 py-1.5"
          style={{ borderColor: "var(--lp-border)", background: "color-mix(in oklab, var(--lp-accent) 8%, var(--lp-card))" }}
        >
          <span style={{ color: "var(--lp-accent)", marginTop: 2 }}><SparkleIcon /></span>
          <span className="text-[12px] leading-snug" style={{ color: "var(--lp-ink)" }}>try: &quot;...most of the time.&quot;</span>
          <button className="ml-1 text-[11px] font-medium hover:underline" style={{ color: "var(--lp-accent)" }}>insert</button>
        </div>

        {/* Drifting cursor */}
        <div className="absolute lp-drift" style={{ top: 92, right: 30 }}>
          <div className="lp-cursor-label" style={{ background: "var(--lp-leaf)" }}>Mira</div>
          <svg width="14" height="14" viewBox="0 0 16 16" className="-mt-0.5">
            <path d="M2 2l11 5-5 1-1 5-5-11z" fill="var(--lp-leaf)" />
          </svg>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3.5 py-1.5 border-t font-mono text-[10px]"
        style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}
      >
        <span>2 here</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-leaf)" }} />
          saved
        </span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden" style={{ background: "var(--lp-paper)" }}>
      <div className="absolute inset-0 lp-bg-dots opacity-50 pointer-events-none lp-fade-mask" />

      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11.5px] mb-6"
              style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)", color: "var(--lp-muted)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-leaf)" }} />
              <span className="font-mono uppercase tracking-wider text-[10.5px]">Open source · MIT</span>
            </div>

            <h1
              className="text-[52px] sm:text-[64px] leading-[1.02] tracking-[-0.03em] font-semibold"
              style={{ color: "var(--lp-ink)" }}
            >
              An open-source <br />
              Google&nbsp;Docs alternative.
            </h1>

            <p className="mt-6 text-[16px] leading-relaxed max-w-[480px]" style={{ color: "var(--lp-muted)" }}>
              DocX is a collaborative document editor with built-in AI commands.
              Real-time sync, version history, self-hostable. Free and open source.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/document"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-md font-medium text-[13.5px] hover:opacity-90 transition-opacity"
                style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
              >
                Open the editor <ArrowIcon />
              </Link>
              <Link
                href="https://github.com/git-init-priyanshu/Docx"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-md border font-medium text-[13.5px] hover:bg-[var(--lp-paper-2)] transition-colors"
                style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)", color: "var(--lp-ink)" }}
              >
                <GithubIcon /> View on GitHub
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-5 text-[12px]" style={{ color: "var(--lp-muted)" }}>
              <span className="flex items-center gap-1.5">
                <span style={{ color: "var(--lp-leaf)" }}><CheckIcon /></span>
                No account needed for the demo
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span style={{ color: "var(--lp-leaf)" }}><CheckIcon /></span>
                Self-hostable
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <MiniDoc />
          </div>
        </div>
      </div>
    </section>
  );
}
