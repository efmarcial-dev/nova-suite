'use client';

export default function DashboardSkeleton() {
  return (
    <div className="h-screen w-full bg-[#f8fafc] flex overflow-hidden">
      {/* Sidebar Skeleton (Foxly dark navy #0D1B2A) */}
      <aside className="w-64 bg-[#0D1B2A] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-5 w-24 bg-white/10 rounded-md animate-pulse" />
          </div>

          {/* Navigation links */}
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 animate-pulse"
              >
                <div className="w-5 h-5 rounded-md bg-white/10" />
                <div className="h-4 w-28 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* User profile bottom */}
        <div className="p-3 rounded-2xl bg-white/5 flex items-center gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-white/10" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-20 bg-white/10 rounded" />
            <div className="h-2.5 w-28 bg-white/10 rounded" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0 p-4 gap-4 overflow-hidden">
        {/* Header Skeleton */}
        <header className="h-16 rounded-2xl bg-white border border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3 w-80">
            <div className="w-4 h-4 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-[#E8F6FF] animate-pulse" />
          </div>
        </header>

        {/* Dashboard Grid Skeleton */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Row 1: 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse" />
                  <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] animate-pulse" />
                </div>
                <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Row 2: Priority Banner Skeleton */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 animate-pulse" />
              <div className="space-y-1">
                <div className="h-3.5 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-2.5 w-60 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
          </div>

          {/* Row 3: Assistant Hub (3 cols) + Projects (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Assistant Hub */}
            <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-72 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-8 w-28 bg-[#F0F9FF] rounded-xl animate-pulse" />
              </div>
              <div className="space-y-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-pulse" />
                      <div className="h-2.5 w-1/2 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects List */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
                      <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
