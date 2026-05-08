import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
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

export default function CTASection() {
  return (
    <section className="py-20" style={{ background: "var(--lp-paper)" }}>
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8">
        <div
          className="relative rounded-[14px] overflow-hidden border p-10 lg:p-12 text-center"
          style={{ borderColor: "var(--lp-border)" }}
        >
          <div className="absolute inset-0 lp-bg-dots opacity-25 lp-fade-mask pointer-events-none" />
          <div className="relative">
            <h2
              className="text-[42px] sm:text-[54px] leading-[1.02] tracking-[-0.03em] font-semibold"
              style={{ color: "var(--lp-ink)" }}
            >
              Ready to give it a try?
            </h2>
            <p className="mt-4 text-[15px] max-w-[460px] mx-auto" style={{ color: "var(--lp-muted)" }}>
              Open the editor demo in your browser — no signup needed. Star the repo on GitHub if you find it useful.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link
                href="/document"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-[13.5px] font-medium hover:opacity-90 transition-opacity"
                style={{ background: "var(--lp-ink)", color: "var(--lp-paper)" }}
              >
                Open the editor <ArrowIcon />
              </Link>
              <Link
                href="https://github.com/git-init-priyanshu/Docx"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-md border text-[13.5px] font-medium hover:bg-[var(--lp-paper-2)] transition-colors"
                style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)", color: "var(--lp-ink)" }}
              >
                <GithubIcon /> Star on GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
