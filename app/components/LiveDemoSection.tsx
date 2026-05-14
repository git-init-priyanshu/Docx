"use client";

import { useState, useEffect } from "react";

function SparkleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

const TABS = [
  { id: "write", label: "Write" },
  { id: "ask", label: "Ask AI" },
  { id: "share", label: "Share" },
];

function WriteSurface() {
  const [stream, setStream] = useState("");
  const target = "and let's see how far this goes.";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStream(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ color: "var(--lp-ink)" }}>
      <h2 className="text-[34px] leading-tight font-semibold tracking-[-0.025em]">Untitled</h2>
      <div className="font-mono text-[10.5px] mt-1" style={{ color: "var(--lp-muted)" }}>draft · saved 12s ago</div>
      <p className="text-[14px] leading-[1.85] mt-5 max-w-[58ch]" style={{ color: "var(--lp-ink)" }}>
        I started building DocX because I wanted to learn how Google Docs works under the hood —
        CRDTs, real-time sync, all that. It turns out it&apos;s a lot, but also kind of fun {stream}
        <span className="lp-caret" style={{ color: "var(--lp-accent)" }}>▎</span>
      </p>
      <p className="text-[14px] leading-[1.85] mt-3 max-w-[58ch] italic" style={{ color: "var(--lp-muted)" }}>
        ↳ DocX: want me to make this less rambly?
      </p>
    </div>
  );
}

function AskSurface() {
  return (
    <div className="max-w-[600px]">
      <div className="rounded-lg border p-3.5" style={{ borderColor: "var(--lp-border)", background: "var(--lp-paper-2)" }}>
        <div className="font-mono text-[10.5px] mb-1.5" style={{ color: "var(--lp-muted)" }}>YOU</div>
        <p className="text-[14px]" style={{ color: "var(--lp-ink)" }}>Make this paragraph one sentence shorter.</p>
      </div>
      <div
        className="mt-2.5 rounded-lg border p-3.5"
        style={{ borderColor: "var(--lp-border)", background: "color-mix(in oklab, var(--lp-accent) 8%, var(--lp-card))" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span style={{ color: "var(--lp-accent)" }}><SparkleIcon /></span>
          <span className="font-mono text-[10.5px]" style={{ color: "var(--lp-accent-ink)" }}>DOCX</span>
        </div>
        <p className="text-[14px] leading-[1.7]" style={{ color: "var(--lp-ink)" }}>
          I started building DocX to learn how real-time collaborative editors work under the hood.
          CRDTs, sync, the whole deal — and surprisingly, kind of fun.
        </p>
        <div className="flex gap-2 mt-2.5">
          <button
            className="text-[11.5px] px-2.5 h-7 rounded text-white"
            style={{ background: "var(--lp-accent)" }}
          >Replace</button>
          <button
            className="text-[11.5px] px-2.5 h-7 rounded border"
            style={{ borderColor: "var(--lp-border)", color: "var(--lp-ink)" }}
          >Insert below</button>
          <button
            className="text-[11.5px] px-2.5 h-7 rounded border"
            style={{ borderColor: "var(--lp-border)", color: "var(--lp-ink)" }}
          >Try again</button>
        </div>
      </div>
    </div>
  );
}

function ShareSurface() {
  const members = [
    { initial: "P", name: "Priyanshu", role: "owner", color: "var(--lp-accent)" },
    { initial: "M", name: "Mira", role: "editor", color: "var(--lp-leaf)" },
    { initial: "A", name: "Aki", role: "commenter", color: "var(--lp-tan)" },
  ];

  return (
    <div className="max-w-[460px]">
      <div className="text-[24px] font-semibold tracking-[-0.025em]" style={{ color: "var(--lp-ink)" }}>Share</div>
      <p className="text-[12.5px] mt-1" style={{ color: "var(--lp-muted)" }}>Anyone with the link can comment.</p>
      <div className="mt-3 rounded-md border flex items-center" style={{ borderColor: "var(--lp-border)" }}>
        <span className="font-mono text-[12px] px-3 py-2 flex-1 truncate" style={{ color: "var(--lp-muted)" }}>
          docx.app/d/9f3a
        </span>
        <button
          className="text-[11.5px] font-medium px-3 h-8 m-1 rounded"
          style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
        >Copy</button>
      </div>
      <ul className="mt-4 divide-y rounded-md border overflow-hidden" style={{ borderColor: "var(--lp-border)" }}>
        {members.map(({ initial, name, role, color }) => (
          <li key={name} className="flex items-center gap-2.5 p-2.5" style={{ borderColor: "var(--lp-border)" }}>
            <span className="w-6 h-6 rounded-full text-white text-[10.5px] font-bold flex items-center justify-center" style={{ background: color }}>
              {initial}
            </span>
            <div className="flex-1">
              <div className="text-[12.5px] font-medium" style={{ color: "var(--lp-ink)" }}>{name}</div>
              <div className="text-[10.5px]" style={{ color: "var(--lp-muted)" }}>{role}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TOOLBAR_BUTTONS = [
  ["pen", "B", "font-bold"],
  ["pen", "I", "italic"],
  ["pen", "U", "underline"],
  null,
  ["list", null, ""],
  ["quote", null, ""],
  ["table", null, ""],
  ["image", null, ""],
  null,
  ["sparkle", null, "text-[var(--lp-accent)]"],
] as const;

export default function LiveDemoSection() {
  const [tab, setTab] = useState("write");

  return (
    <section
      className="relative py-20 border-t border-b"
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8">
        <div className="max-w-[640px]">
          <div className="font-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--lp-muted)" }}>
            A peek inside
          </div>
          <h2
            className="text-[38px] sm:text-[46px] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ color: "var(--lp-ink)" }}
          >
            A look at the editor.
          </h2>
          <p className="mt-3 text-[15px] max-w-[520px]" style={{ color: "var(--lp-muted)" }}>
            Built on Tiptap and Y.js. Switch between writing, asking AI, and managing access — all from the same surface.
          </p>
        </div>

        <div
          className="mt-10 border rounded-[10px] lp-doc-shadow overflow-hidden"
          style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
        >
          {/* Tab bar */}
          <div className="flex items-center border-b px-3" style={{ borderColor: "var(--lp-border)" }}>
            <div className="flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative px-3.5 h-10 text-[12.5px] font-medium transition-colors"
                  style={{ color: tab === t.id ? "var(--lp-ink)" : "var(--lp-muted)" }}
                >
                  {t.label}
                  {tab === t.id && (
                    <span
                      className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full"
                      style={{ background: "var(--lp-accent)" }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1.5 mr-3" style={{ color: "var(--lp-muted)" }}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="9" cy="9" r="3.2" /><path d="M2.5 19c.6-3 3.4-4.6 6.5-4.6s5.9 1.6 6.5 4.6" />
                <circle cx="17" cy="9" r="2.6" /><path d="M16 14.6c2.4.2 4.4 1.5 5 3.4" />
              </svg>
              <span className="font-mono text-[10.5px]">3 here</span>
            </div>
          </div>

          {/* Format toolbar */}
          <div
            className="flex items-center gap-1 px-3 py-1.5 border-b overflow-x-auto"
            style={{ borderColor: "var(--lp-border)" }}
          >
            {(["B", "I", "U"] as const).map((l) => (
              <button
                key={l}
                className={`h-7 min-w-7 px-1.5 rounded text-[12px] flex items-center justify-center hover:bg-[var(--lp-paper-2)] ${l === "B" ? "font-bold" : l === "I" ? "italic" : "underline"}`}
                style={{ color: "var(--lp-ink)" }}
              >{l}</button>
            ))}
            <span className="w-px h-4 mx-1" style={{ background: "var(--lp-border)" }} />
            {(["list", "quote", "table"] as const).map((name) => (
              <button key={name} className="h-7 w-7 rounded flex items-center justify-center hover:bg-[var(--lp-paper-2)]" style={{ color: "var(--lp-muted)" }}>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {name === "list" && <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />}
                  {name === "quote" && <path d="M7 7h4v4c0 3-2 5-4 6V14H4V7h3zm9 0h4v4c0 3-2 5-4 6V14h-3V7h3z" />}
                  {name === "table" && <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 16h18M9 4v16M15 4v16" /></>}
                </svg>
              </button>
            ))}
            <span className="w-px h-4 mx-1" style={{ background: "var(--lp-border)" }} />
            <button className="h-7 min-w-7 px-1.5 rounded flex items-center justify-center gap-1 text-[12px] hover:bg-[var(--lp-paper-2)]" style={{ color: "var(--lp-accent)" }}>
              <SparkleIcon />
            </button>
          </div>

          {/* Content area */}
          <div className="grid md:grid-cols-[1fr,220px]">
            <div className="px-8 py-8 min-h-[360px] relative">
              {tab === "write" && <WriteSurface />}
              {tab === "ask" && <AskSurface />}
              {tab === "share" && <ShareSurface />}
            </div>
            <aside className="border-l p-4" style={{ borderColor: "var(--lp-border)", background: "var(--lp-paper-2)" }}>
              <div className="font-mono uppercase tracking-wider text-[10px] mb-2.5" style={{ color: "var(--lp-muted)" }}>Outline</div>
              <ul className="space-y-1.5 text-[12.5px]">
                <li className="font-medium" style={{ color: "var(--lp-ink)" }}>Untitled — March 14</li>
                <li className="pl-3 border-l-2" style={{ borderColor: "var(--lp-accent)", color: "var(--lp-muted)" }}>Intro</li>
                <li className="pl-3" style={{ color: "var(--lp-muted)" }}>Why I&apos;m building this</li>
                <li className="pl-3" style={{ color: "var(--lp-muted)" }}>What works</li>
                <li className="pl-3" style={{ color: "var(--lp-muted)" }}>Todo list</li>
              </ul>
              <div className="mt-5 font-mono uppercase tracking-wider text-[10px] mb-2.5" style={{ color: "var(--lp-muted)" }}>Comments</div>
              <div className="rounded-md border p-2" style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)" }}>
                <div className="flex items-center gap-1.5 text-[10.5px]">
                  <span className="w-3.5 h-3.5 rounded-full text-white flex items-center justify-center text-[7px] font-bold" style={{ background: "var(--lp-leaf)" }}>M</span>
                  <b style={{ color: "var(--lp-ink)" }}>Mira</b>
                  <span style={{ color: "var(--lp-muted)" }}>2m</span>
                </div>
                <p className="text-[11.5px] mt-0.5" style={{ color: "var(--lp-ink)" }}>looks good!</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
