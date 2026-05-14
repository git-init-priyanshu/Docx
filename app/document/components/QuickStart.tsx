import DocThumbnail from "@/components/DocThumbnail";
import { TEMPLATES } from "@/lib/templates";
import NewDocButton from "./NewDocButton";

export default function QuickStart() {
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] mb-1 text-[var(--lp-muted)]">
            Start a new document
          </div>
          <h2 className="text-[20px] font-semibold tracking-tight text-[var(--lp-ink)]">
            Pick a template
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TEMPLATES.map((t) => (
          <NewDocButton
            key={t.id}
            content={t.content || undefined}
            className="rounded-lg p-3 text-left border border-[var(--lp-border)] bg-[var(--lp-card)] transition hover:border-[var(--lp-accent)]"
          >
            {t.id === "blank" ? (
              <div
                className="rounded-md border-2 border-dashed border-[var(--lp-border)] flex items-center justify-center mb-2.5"
                style={{ aspectRatio: "4/3" }}
              >
                <svg
                  className="w-6 h-6 text-[var(--lp-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
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
            <div className="text-[13px] font-medium text-[var(--lp-ink)]">{t.label}</div>
            <div className="text-[11px] mt-0.5 text-[var(--lp-muted)]">{t.hint}</div>
          </NewDocButton>
        ))}
      </div>
    </section>
  );
}
