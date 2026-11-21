import { Library, Server, SunMoon, UserRound } from "lucide-react";

const EXTRAS = [
  {
    Icon: Library,
    title: "Public library",
    body: "999 Wikipedia articles anyone can search, read and ask questions about. No account needed.",
  },
  {
    Icon: UserRound,
    title: "Guest mode",
    body: "Start writing instantly. Documents and versions stay in your browser until you sign in.",
  },
  {
    Icon: Server,
    title: "Self-hostable",
    body: "Clone the repo, point it at your own Postgres, and it's yours. Open source, no hidden tiers.",
  },
  {
    Icon: SunMoon,
    title: "Light and dark",
    body: "A warm paper theme and a dark one, built on one set of design tokens.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="pb-20" style={{ background: "var(--lp-paper)" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 lg:px-8">
        <div
          className="font-mono text-[11px] uppercase tracking-wider mb-4"
          style={{ color: "var(--lp-muted)" }}
        >
          And also
        </div>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-[10px] border overflow-hidden"
          style={{
            background: "var(--lp-border)",
            borderColor: "var(--lp-border)",
          }}
        >
          {EXTRAS.map(({ Icon, title, body }) => (
            <div key={title} className="lp-feature-card p-6 group">
              <div
                className="w-9 h-9 rounded-md border flex items-center justify-center mb-4 transition-transform group-hover:-rotate-3"
                style={{
                  borderColor: "var(--lp-border)",
                  color: "var(--lp-accent)",
                }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.6} />
              </div>
              <div
                className="font-medium text-[15px] mb-1"
                style={{ color: "var(--lp-ink)" }}
              >
                {title}
              </div>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--lp-muted)" }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
