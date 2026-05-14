export default function Loading() {
  return (
    <div
      className="w-[816.3px] mx-auto my-4 rounded-md p-24 lp-doc-shadow"
      style={{ background: "var(--lp-card)", border: "1px solid var(--lp-border)" }}
    >
      <div className="h-3 w-24 rounded animate-pulse mb-5" style={{ background: "var(--lp-paper-2)" }} />
      <div className="h-10 w-80 rounded animate-pulse mb-2" style={{ background: "var(--lp-paper-2)" }} />
      <div className="h-3 w-48 rounded animate-pulse mb-8" style={{ background: "var(--lp-paper-2)" }} />

      <div className="h-3 w-32 rounded animate-pulse mb-3" style={{ background: "var(--lp-paper-2)" }} />
      <div className="space-y-2 mb-6">
        {[560, 612, 490, 582, 530].map((w, i) => (
          <div key={i} className="h-3 rounded animate-pulse" style={{ width: w, background: "var(--lp-paper-2)" }} />
        ))}
      </div>

      <div className="h-3 w-28 rounded animate-pulse mb-3" style={{ background: "var(--lp-paper-2)" }} />
      <div className="space-y-2">
        {[420, 500, 380].map((w, i) => (
          <div key={i} className="h-3 rounded animate-pulse" style={{ width: w, background: "var(--lp-paper-2)" }} />
        ))}
      </div>
    </div>
  );
}
