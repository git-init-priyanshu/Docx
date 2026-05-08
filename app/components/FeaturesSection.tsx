const FEATURES = [
  {
    icon: "users",
    title: "Real-time collab",
    body: "Cursors, comments, and edits sync over Y.js. Up to a few dozen people can edit the same page.",
  },
  {
    icon: "sparkle",
    title: "AI helpers",
    body: "Highlight a paragraph, ask for a rewrite or a summary. Bring your own OpenAI / Anthropic key.",
  },
  {
    icon: "history",
    title: "Version history",
    body: "Every change is saved. Roll back, branch a copy, or compare two versions side-by-side.",
  },
  {
    icon: "lock",
    title: "Self-hostable",
    body: "Clone the repo, run `docker compose up`, and it's yours. MIT-licensed, no hidden tiers.",
  },
  {
    icon: "layers",
    title: "Outline view",
    body: "Drag headings to reorder sections. The document follows along — no copy-paste between blocks.",
  },
  {
    icon: "plug",
    title: "Open API",
    body: "REST endpoints for documents, comments, and exports. Webhook on every save.",
  },
];

function FeatureIcon({ name }: { name: string }) {
  const common = "fill-none stroke-current";
  const icons: Record<string, React.ReactNode> = {
    users: (
      <>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M2.5 19c.6-3 3.4-4.6 6.5-4.6s5.9 1.6 6.5 4.6" />
        <circle cx="17" cy="9" r="2.6" />
        <path d="M16 14.6c2.4.2 4.4 1.5 5 3.4" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
        <circle cx="12" cy="12" r="2.2" />
      </>
    ),
    history: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
        <path d="M3 8a9 9 0 0 1 3-4" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </>
    ),
    plug: <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0V7zM12 16v5" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${common}`}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20" style={{ background: "var(--lp-paper)" }}>
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8">
        <div className="max-w-[640px] mb-12">
          <div className="font-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--lp-muted)" }}>
            Features
          </div>
          <h2
            className="text-[38px] sm:text-[46px] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ color: "var(--lp-ink)" }}
          >
            Everything you&apos;d expect,<br />and a few things you wouldn&apos;t.
          </h2>
        </div>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-[10px] border overflow-hidden"
          style={{ background: "var(--lp-border)", borderColor: "var(--lp-border)" }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="lp-feature-card p-6 group"
            >
              <div
                className="w-9 h-9 rounded-md border flex items-center justify-center mb-4 transition-transform group-hover:-rotate-3"
                style={{ borderColor: "var(--lp-border)", color: "var(--lp-accent)" }}
              >
                <FeatureIcon name={f.icon} />
              </div>
              <div className="font-medium text-[15px] mb-1" style={{ color: "var(--lp-ink)" }}>{f.title}</div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--lp-muted)" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
