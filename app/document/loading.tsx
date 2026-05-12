export default function Loading() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[var(--lp-paper)]">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-[260px] shrink-0 border-r border-[var(--lp-border)] bg-[var(--lp-paper-2)] h-full" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar skeleton */}
        <div className="h-[52px] border-b border-[var(--lp-border)] bg-[var(--lp-card)] shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 overflow-y-auto bg-[var(--lp-paper)]">
          <div className="max-w-[1180px] mx-auto px-6 md:px-8 py-8">
            <div className="mb-8">
              <div className="h-2.5 w-20 rounded animate-pulse bg-[var(--lp-border)] mb-2" />
              <div className="h-10 w-64 rounded animate-pulse bg-[var(--lp-border)] mb-2" />
              <div className="h-2.5 w-48 rounded animate-pulse bg-[var(--lp-border)]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] animate-pulse"
                  style={{ aspectRatio: "4/5" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
