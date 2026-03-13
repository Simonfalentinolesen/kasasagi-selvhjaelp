import { cn } from '@/lib/cn'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && <div className="mb-4 text-fg-muted">{icon}</div>}
      <h3 className="text-lg font-medium text-fg-primary">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-fg-secondary">{description}</p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
