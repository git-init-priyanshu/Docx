"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const AI_ACTIONS = ["Tighten", "Expand", "Rephrase", "Translate", "Simpler", "Counter-argue"];

const HISTORY = [
  { time: "just now", who: "you", what: "opened document" },
  { time: "auto", who: "DocX", what: "saved changes" },
  { time: "earlier", who: "you", what: "edited content" },
];

export default function RightRail() {
  const [tab, setTab] = useState<"ai" | "outline" | "history">("ai");

  return (
    <aside
      className="w-[280px] border-l hidden xl:flex flex-col shrink-0"
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      {/* Tab headers */}
      <div className="h-[52px] border-b flex shrink-0" style={{ borderColor: "var(--lp-border)" }}>
        {(["ai", "outline", "history"] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 text-[12.5px] font-medium relative transition-colors capitalize"
            style={{ color: tab === id ? "var(--lp-ink)" : "var(--lp-muted)" }}
          >
            {id === "ai" ? "AI" : id.charAt(0).toUpperCase() + id.slice(1)}
            {tab === id && (
              <span
                className="absolute left-4 right-4 bottom-0 h-0.5 rounded-full"
                style={{ background: "var(--lp-accent)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* AI tab */}
      {tab === "ai" && (
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)" }}
          >
            <div className="font-mono text-[10px] mb-1" style={{ color: "var(--lp-muted)" }}>SELECTION</div>
            <div className="text-[12.5px]" style={{ color: "var(--lp-muted)" }}>Select text to use AI</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action}
                className="text-left text-[12px] px-2.5 py-2 rounded-md border transition-colors hover:bg-[var(--lp-card)]"
                style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)", color: "var(--lp-ink)" }}
              >
                {action}
              </button>
            ))}
          </div>

          <div
            className="rounded-lg border p-3"
            style={{
              borderColor: "var(--lp-border)",
              background: "color-mix(in oklab, var(--lp-accent) 8%, var(--lp-card))",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--lp-accent)" }} />
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--lp-accent)" }}>
                DocX AI
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--lp-ink)" }}>
              Select text in the editor, then choose an action above to get AI suggestions.
            </p>
          </div>
        </div>
      )}

      {/* Outline tab */}
      {tab === "outline" && (
        <div className="p-4 flex flex-col gap-3">
          <div className="text-[12.5px] font-medium" style={{ color: "var(--lp-ink)" }}>Document outline</div>
          <p className="text-[12.5px]" style={{ color: "var(--lp-muted)" }}>
            Add headings to your document to see an outline here.
          </p>
        </div>
      )}

      {/* History tab */}
      {tab === "history" && (
        <div className="p-4 flex flex-col gap-3">
          {HISTORY.map(({ time, who, what }, i) => (
            <div key={i} className="flex gap-3">
              <div className="font-mono text-[10.5px] w-12 mt-0.5 shrink-0" style={{ color: "var(--lp-muted)" }}>
                {time}
              </div>
              <div className="flex-1 text-[12.5px]" style={{ color: "var(--lp-ink)" }}>
                <b>{who}</b>{" "}
                <span style={{ color: "var(--lp-muted)" }}>{what}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
