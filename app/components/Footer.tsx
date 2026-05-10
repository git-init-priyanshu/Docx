import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.svg";

function DocxLogo({ width = 30 }: { width?: number }) {
  return <Image src={logo} width={width} alt="logo" />;
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
        </div>
      </div>
    </footer>
  );
}
