import { cn } from '@/lib/cn'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'We hit a snag',
  message = 'This didn\u2019t load as expected. Try refreshing, or browse our help center for more options.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <AlertCircle className="mb-4 h-10 w-10 text-error" />
      <h3 className="text-lg font-medium text-fg-primary">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-fg-secondary">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
