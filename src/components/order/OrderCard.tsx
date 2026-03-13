import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/Badge'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { Order, OrderStatus } from '@/types/order'

const statusVariant: Record<OrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  pending: 'info',
  confirmed: 'info',
  packed: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'error',
  returned: 'neutral',
}

interface OrderCardProps {
  order: Order
  className?: string
}

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <div className={cn('rounded-md border border-border bg-bg-surface p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-fg-primary">
              {order.orderNumber}
            </span>
            <Badge variant={statusVariant[order.status]}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-fg-secondary">
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {' · '}
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <p className="text-sm font-medium text-fg-primary whitespace-nowrap">
          {order.totals.total.toLocaleString('da-DK')} {order.totals.currency}
        </p>
      </div>

      <div className="mt-3 flex gap-2 overflow-hidden">
        {order.items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="h-12 w-12 shrink-0 rounded border border-border overflow-hidden bg-bg-surface-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-bg-surface-2 text-xs text-fg-muted">
            +{order.items.length - 3}
          </div>
        )}
      </div>
    </div>
  )
}
