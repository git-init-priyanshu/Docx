import { Sparkles, Check } from "lucide-react";

/**
 * Right-side "peek inside" preview shown next to the sign-in form. Renders a
 * scaled mock of a DocX document so visitors get a sense of the editor before
 * they create an account.
 */
export default function AuthAside() {
  return (
    <div className="relative w-full flex items-center justify-center p-12">
      <div className="max-w-[440px]">
        <div className="font-mono text-[10.5px] text-[var(--lp-muted)] uppercase tracking-[0.18em] mb-3">
          A peek inside
        </div>
        <h2 className="text-[34px] leading-[1.1] tracking-[-0.03em] font-semibold text-[var(--lp-ink)] mb-3">
          Documents your team actually wants to write in.
        </h2>
        <p className="text-[14px] text-[var(--lp-muted)] leading-relaxed mb-8">
          Real-time collaboration, inline AI commands, full version history.
          Self-hostable and open source.
        </p>

        {/* Mock doc card */}
        <div className="bg-[var(--lp-card)] border border-[var(--lp-border)] rounded-[10px] doc-shadow overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--lp-border)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E36F5C]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5C25A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#7BB47A]" />
              <span className="ml-2.5 font-mono text-[11px] text-[var(--lp-muted)]">
                project-brief.docx
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-[var(--lp-accent)] text-white text-[9px] font-semibold flex items-center justify-center ring-2 ring-[var(--lp-card)]">
                P
              </span>
              <span className="w-5 h-5 rounded-full bg-[var(--lp-leaf)] text-white text-[9px] font-semibold flex items-center justify-center -ml-1.5 ring-2 ring-[var(--lp-card)]">
                M
              </span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--lp-ink)] mb-0.5">
              Project Brief — Q2
            </div>
            <div className="font-mono text-[10px] text-[var(--lp-muted)] mb-3">
              draft · saved 12s ago
            </div>
            <p className="text-[12.5px] leading-[1.7] text-[var(--lp-ink)]">
              Goals for the next quarter. Ship the new{" "}
              <span className="bg-[color-mix(in_oklab,var(--lp-accent)_20%,transparent)] rounded-sm px-0.5">
                editor surface
              </span>
              , finalize the comments thread UI, and migrate from postgres 14 to
              16.
            </p>
            <div className="mt-3 inline-flex items-start gap-2 rounded-md border border-[var(--lp-border)] px-2.5 py-1.5 bg-[color-mix(in_oklab,var(--lp-accent)_8%,var(--lp-card))]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--lp-accent)] mt-0.5 shrink-0" />
              <div className="text-[11.5px] leading-snug text-[var(--lp-ink)]">
                Add a section on rollout plan?
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-[var(--lp-border)] font-mono text-[10px] text-[var(--lp-muted)]">
            <span>2 here</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lp-leaf)]" />{" "}
              saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
