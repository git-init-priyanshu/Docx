"use client";

const TEMPLATES = [
  { id: "blank",   label: "Blank document", hint: "Start from scratch" },
  { id: "meeting", label: "Meeting notes",  hint: "Agenda · Attendees · Actions" },
  { id: "brief",   label: "Project brief",  hint: "Goals · Scope · Risks" },
  { id: "rfc",     label: "RFC",            hint: "Problem · Proposal · Tradeoffs" },
];

const TILE_COLORS = ["var(--lp-accent)", "var(--lp-leaf)", "var(--lp-rose)"];

type QuickStartProps = { onCreate: () => void };

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
        <span
          className="text-[12.5px] flex items-center gap-1 cursor-pointer"
          style={{ color: "var(--lp-muted)" }}
        >
          All templates
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
          </svg>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Blank */}
        <button
          onClick={onCreate}
          className="rounded-lg p-3 text-left border transition hover:border-[var(--lp-accent)]"
          style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
        >
          <div
            className="rounded-md border-2 border-dashed flex items-center justify-center mb-2.5"
            style={{ aspectRatio: "4/3", borderColor: "var(--lp-border)" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--lp-muted)" }}>
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="text-[13px] font-medium" style={{ color: "var(--lp-ink)" }}>
            {TEMPLATES[0].label}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--lp-muted)" }}>
            {TEMPLATES[0].hint}
          </div>
        </button>

        {/* Other templates */}
        {TEMPLATES.slice(1).map((t, i) => (
          <button
            key={t.id}
            onClick={onCreate}
            className="rounded-lg p-3 text-left border transition hover:border-[var(--lp-accent)]"
            style={{ background: "var(--lp-card)", borderColor: "var(--lp-border)" }}
          >
            <div
              className="rounded-md p-2.5 mb-2.5 overflow-hidden"
              style={{ aspectRatio: "4/3", background: "var(--lp-paper-2)" }}
            >
              <div
                className="h-1.5 w-2/3 rounded-full mb-1.5"
                style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}
              />
              <div className="doc-thumb-lines h-full opacity-70" />
            </div>
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
