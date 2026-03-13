'use client'

import { cn } from '@/lib/cn'
import { Check, Circle } from 'lucide-react'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from '@/lib/constants'
import type { OrderStatus } from '@/types/order'

interface StatusTimelineProps {
  currentStatus: OrderStatus
  className?: string
}

export function StatusTimeline({ currentStatus, className }: StatusTimelineProps) {
  const isCancelled = currentStatus === 'cancelled'
  const isReturned = currentStatus === 'returned'
  const currentIndex = ORDER_STATUS_STEPS.indexOf(currentStatus)

  if (isCancelled || isReturned) {
    return (
      <div className={cn('rounded-md border border-border p-4', className)}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-white',
            isCancelled ? 'bg-error' : 'bg-fg-muted'
          )}>
            <Circle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium text-fg-primary">
              {ORDER_STATUS_LABELS[currentStatus]}
            </p>
            <p className="text-sm text-fg-secondary">
              {isCancelled
                ? 'This order has been cancelled.'
                : 'This order has been returned.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-0', className)} role="list" aria-label="Order status">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        const isFuture = i > currentIndex

        return (
          <div key={step} className="flex gap-3" role="listitem">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                  isCompleted && 'bg-success text-white',
                  isCurrent && 'bg-accent text-white ring-4 ring-blue-100',
                  isFuture && 'bg-bg-surface-2 text-fg-muted'
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </div>
              {i < ORDER_STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px]',
                    isCompleted ? 'bg-success' : 'bg-bg-surface-2'
                  )}
                />
              )}
            </div>
            <div className="pb-6 last:pb-0">
              <p
                className={cn(
                  'text-sm leading-7',
                  isCurrent ? 'font-medium text-fg-primary' : 'text-fg-secondary',
                  isFuture && 'text-fg-muted'
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
