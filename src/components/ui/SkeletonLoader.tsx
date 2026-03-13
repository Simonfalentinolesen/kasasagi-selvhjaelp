import { cn } from '@/lib/cn'

interface SkeletonProps {
  className?: string
  lines?: number
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-4 rounded bg-bg-surface-2 animate-pulse',
        className
      )}
    />
  )
}

export function SkeletonLoader({ className, lines = 3 }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-md border border-border p-4 space-y-3', className)} role="status" aria-label="Loading">
      <div className="h-5 w-1/3 rounded bg-bg-surface-2 animate-pulse" />
      <div className="h-4 w-full rounded bg-bg-surface-2 animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-bg-surface-2 animate-pulse" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
