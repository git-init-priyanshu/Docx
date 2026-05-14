const STEPS = [
  {
    n: "1",
    t: "Open a doc",
    b: "Login, click new. Or just go straight to the editor demo without an account.",
  },
  {
    n: "2",
    t: "Invite people",
    b: "Share the link. They can comment without an account, or login to edit alongside you.",
  },
  {
    n: "3",
    t: "Use AI when stuck",
    b: "Highlight text and press ⌘K. Ask for a rewrite, a counter-argument, or a translation.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how"
      className="py-20 border-t border-b"
      style={{ background: "var(--lp-paper-2)", borderColor: "var(--lp-border)" }}
    >
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8">
        <div className="max-w-[600px] mb-12">
          <div className="font-mono text-[11px] uppercase tracking-wider mb-2" style={{ color: "var(--lp-muted)" }}>
            How it works
          </div>
          <h2
            className="text-[34px] sm:text-[42px] leading-[1.05] tracking-[-0.03em] font-semibold"
            style={{ color: "var(--lp-ink)" }}
          >
            Three steps.{" "}
            <span className="font-normal" style={{ color: "var(--lp-muted)" }}>That&apos;s it.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-mono text-[36px] leading-none font-medium" style={{ color: "var(--lp-accent)" }}>
                {s.n}
              </div>
              <div className="font-medium text-[17px] mt-3" style={{ color: "var(--lp-ink)" }}>{s.t}</div>
              <p className="text-[13.5px] leading-relaxed mt-1.5 max-w-[34ch]" style={{ color: "var(--lp-muted)" }}>
                {s.b}
              </p>
              {i < 2 && (
                <svg
                  className="hidden md:block absolute top-6 -right-6 w-12 h-6"
                  viewBox="0 0 48 24"
                >
                  <path
                    d="M2 12 C 14 4, 30 20, 46 12"
                    fill="none"
                    stroke="var(--lp-muted)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <path
                    d="M42 8 L46 12 L42 16"
                    fill="none"
                    stroke="var(--lp-muted)"
                    strokeWidth="1"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
