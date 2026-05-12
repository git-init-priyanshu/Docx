"use client";

import DocThumbnail from "@/components/DocThumbnail";
import { TEMPLATES } from "@/lib/templates";

type QuickStartProps = { onCreate: (content?: string) => void };

export default function QuickStart({ onCreate }: QuickStartProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div
            className="font-mono text-[10.5px] uppercase tracking-[0.18em] mb-1"
            style={{ color: "var(--lp-muted)" }}
          >
            Start a new document
          </div>
          <h2
            className="text-[20px] font-semibold tracking-tight"
            style={{ color: "var(--lp-ink)" }}
          >
            Pick a template
          </h2>
        </div>
        {/* <span
          className="text-[12.5px] flex items-center gap-1 cursor-pointer"
          style={{ color: "var(--lp-muted)" }}
        >
          All templates
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
          </svg>
        </span> */}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onCreate(t.content || undefined)}
            className="rounded-lg p-3 text-left border transition hover:border-[var(--lp-accent)]"
            style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
          >
            {t.id === "blank" ? (
              <div
                className="rounded-md border-2 border-dashed flex items-center justify-center mb-2.5"
                style={{ aspectRatio: "4/3", borderColor: "var(--lp-border)" }}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  style={{ color: "var(--lp-muted)" }}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            ) : (
              <DocThumbnail
                data={t.content}
                accentColor={t.accentColor}
                className="rounded-md mb-2.5"
                style={{ aspectRatio: "4/3" }}
              />
            )}
            <div className="text-[13px] font-medium" style={{ color: "var(--lp-ink)" }}>
              {t.label}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--lp-muted)" }}>
              {t.hint}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
