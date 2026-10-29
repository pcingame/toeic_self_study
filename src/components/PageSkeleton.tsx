function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-[var(--color-surface-2)] ${className}`} />;
}

export default function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-72" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
