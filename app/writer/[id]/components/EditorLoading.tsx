const Line = ({ width }: { width: string }) => (
  <div
    className="h-3 animate-pulse rounded bg-[var(--lp-paper-2)]"
    style={{ width }}
  />
);

// Geometry is kept in step with `props.attributes` in editorConfig, so the real
// document does not jump into place when it replaces this.
export default function Loading() {
  return (
    <div className="mx-auto my-6 w-full max-w-[860px] rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] px-6 py-10 lp-doc-shadow sm:px-12 sm:py-14 md:px-20">
      <div className="mb-5 h-3 w-24 animate-pulse rounded bg-[var(--lp-paper-2)]" />
      <div className="mb-3 h-9 w-3/5 animate-pulse rounded bg-[var(--lp-paper-2)]" />
      <div className="mb-8 h-3 w-2/5 animate-pulse rounded bg-[var(--lp-paper-2)]" />

      <div className="mb-3 h-3 w-1/4 animate-pulse rounded bg-[var(--lp-paper-2)]" />
      <div className="mb-6 space-y-2">
        {["92%", "100%", "80%", "95%", "87%"].map((width) => (
          <Line key={width} width={width} />
        ))}
      </div>

      <div className="mb-3 h-3 w-1/5 animate-pulse rounded bg-[var(--lp-paper-2)]" />
      <div className="space-y-2">
        {["69%", "82%", "62%"].map((width) => (
          <Line key={width} width={width} />
        ))}
      </div>
    </div>
  );
}
