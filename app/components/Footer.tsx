import Link from "next/link";

function DocxLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-label="DocX">
      <rect x="6" y="4" width="42" height="56" rx="6" fill="var(--lp-paper-2)" stroke="var(--lp-border)" strokeWidth="1.5" />
      <path d="M14 18h22M14 26h26M14 34h20M14 42h24" stroke="var(--lp-muted)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="46" r="11" fill="var(--lp-accent)" />
      <path d="M46 46l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: "var(--lp-border)", background: "var(--lp-paper)" }}>
      <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <DocxLogo />
          <span className="font-semibold text-[15px] tracking-tight" style={{ color: "var(--lp-ink)" }}>DocX</span>
          <span className="text-[12.5px] ml-1" style={{ color: "var(--lp-muted)" }}>
            — made by{" "}
            <Link
              href="https://github.com/git-init-priyanshu"
              className="underline hover:text-[var(--lp-accent)] transition-colors"
            >
              @priyanshu
            </Link>
          </span>
        </div>

        <div className="flex items-center gap-5 text-[12.5px] font-mono" style={{ color: "var(--lp-muted)" }}>
          <Link href="https://github.com/git-init-priyanshu/Docx" className="hover:text-[var(--lp-ink)] transition-colors">github</Link>
          <Link href="https://x.com/PriyanshuBartw5" className="hover:text-[var(--lp-ink)] transition-colors">twitter</Link>
          <Link href="https://www.linkedin.com/in/priyanshu-bartwal/" className="hover:text-[var(--lp-ink)] transition-colors">linkedin</Link>
          <span>MIT</span>
        </div>
      </div>
    </footer>
  );
}
