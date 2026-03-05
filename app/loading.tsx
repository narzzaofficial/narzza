export default function Loading() {
  return (
    <div className="page-shell">
      <div className="content-grid">
        {/* Sidebar Kiri — skeleton */}
        <aside className="w-72 shrink-0 sidebar-sticky">
          <div className="sidebar-widget flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 animate-pulse rounded bg-slate-700/50" />
              <div className="space-y-1">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-700/50" />
                <div className="h-2 w-20 animate-pulse rounded bg-slate-700/50" />
              </div>
            </div>
            <div className="drawer-divider" />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-1 py-1">
                <div className="h-4 w-4 animate-pulse rounded bg-slate-700/50" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-700/50" />
              </div>
            ))}
            <div className="drawer-divider" />
            <div className="h-8 w-full animate-pulse rounded bg-slate-700/50" />
          </div>
        </aside>

        {/* Konten Utama — skeleton */}
        <main className="mx-auto w-full min-w-0 max-w-3xl space-y-4 p-4">
          {/* Hero block */}
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-700/50" />
            <div className="h-7 w-2/3 animate-pulse rounded bg-slate-700/50" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-slate-700/50" />
          </div>
          {/* Feed cards */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4"
            >
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-slate-700/50" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700/50" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-700/50" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-700/50" />
              </div>
            </div>
          ))}
        </main>

        {/* Sidebar Kanan — skeleton */}
        <aside className="w-64 shrink-0 sidebar-sticky">
          <div className="space-y-4">
            <div className="h-[250px] animate-pulse rounded-xl bg-slate-700/30" />
            <div className="h-[120px] animate-pulse rounded-xl bg-slate-700/30" />
            <div className="h-[90px] animate-pulse rounded-xl bg-slate-700/30" />
          </div>
        </aside>
      </div>
    </div>
  );
}
