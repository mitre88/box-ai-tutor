export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-lg bg-[color:var(--border)]" />
        <div className="h-4 w-96 max-w-full rounded-md bg-[color:var(--border)]" />
      </div>

      {/* Card skeleton */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <div className="h-5 w-48 rounded-md bg-[color:var(--border)]" />
        <div className="h-12 w-full rounded-lg bg-[color:var(--border)]" />
        <div className="h-4 w-72 max-w-full rounded-md bg-[color:var(--border)]" />
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-lg bg-[color:var(--border)]" />
          <div className="h-10 w-40 rounded-lg bg-[color:var(--border)]" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 space-y-3">
            <div className="h-4 w-32 rounded-md bg-[color:var(--border)]" />
            <div className="h-3 w-full rounded-md bg-[color:var(--border)]" />
            <div className="h-3 w-2/3 rounded-md bg-[color:var(--border)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
