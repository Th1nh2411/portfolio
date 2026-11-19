interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`shimmer rounded-lg bg-ink-100 dark:bg-ink-800 ${className}`}
    />
  )
}

export function ProjectCardSkeleton() {
  // Same footprint as a bento project card (browser frame + body)
  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-800 p-3.5 space-y-4">
      <Skeleton className="aspect-[16/10] w-full rounded-[10px]" />
      <div className="px-1.5 pb-2 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-1.5 pt-2">
          <Skeleton className="h-7 w-7" />
          <Skeleton className="h-7 w-7" />
          <Skeleton className="h-7 w-7" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}
