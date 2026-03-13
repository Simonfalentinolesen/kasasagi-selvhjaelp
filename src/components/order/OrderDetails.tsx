'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatusTimeline } from './StatusTimeline'
import { OrderActions } from './OrderActions'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { Order, OrderStatus, ItemAvailability } from '@/types/order'
import { CalendarDays, Copy, Check, AlertTriangle, Clock, PackageX, Truck } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const statusVariant: Record<OrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  pending: 'info',
  confirmed: 'info',
  packed: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'error',
  returned: 'neutral',
}

const availabilityConfig: Record<ItemAvailability, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  in_stock: { label: 'In stock', variant: 'success' },
  delayed: { label: 'Delayed', variant: 'warning' },
  backordered: { label: 'Backordered', variant: 'error' },
  discontinued: { label: 'Discontinued', variant: 'neutral' },
}

interface OrderDetailsProps {
  order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [copied, setCopied] = useState(false)

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-2xl text-fg-primary">
            Order {order.orderNumber}
          </h1>
          <button
            onClick={copyOrderNumber}
            className="rounded p-1 text-fg-muted hover:text-fg-primary transition-colors"
            aria-label="Copy order number"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-fg-secondary">
          <Badge variant={statusVariant[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
          <span>
            Placed{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* ── DELAY ALERT ── */}
      {order.delayInfo?.isDelayed && (
        <div className="rounded-md border border-warning/40 bg-warning/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-fg-primary">
                Your order is delayed
              </p>
              <p className="text-sm text-fg-secondary">
                {order.delayInfo.reason}
              </p>
              <div className="flex items-center gap-4 text-xs text-fg-muted mt-2">
                <span className="line-through">
                  Original: {new Date(order.delayInfo.originalEstimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <span className="font-medium text-warning">
                  New estimate: {new Date(order.delayInfo.newEstimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>
          </div>

          {/* Partial delivery option */}
          {order.delayInfo.partialDeliveryAvailable && (
            <div className="rounded-md border border-border bg-bg-surface p-3 ml-8">
              <div className="flex items-start gap-2.5">
                <Truck className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-fg-primary">
                    Partial delivery available
                  </p>
                  <p className="text-xs text-fg-secondary">
                    Some items are ready to ship now. You can choose to receive available items first, or wait for the full order.
                  </p>
                  <div className="text-xs text-fg-muted">
                    <span className="font-medium text-success">Ready now:</span>{' '}
                    {order.items
                      .filter((item) => order.delayInfo?.availableItemIds?.includes(item.id))
                      .map((item) => item.name)
                      .join(', ')}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="primary">
                      Ship available items now
                    </Button>
                    <Button size="sm" variant="ghost">
                      Wait for full order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel option */}
          {order.cancelEligible && (
            <div className="ml-8">
              <Link href={`/order/${order.id}/cancel`}>
                <Button size="sm" variant="ghost" className="text-error hover:text-error">
                  Cancel this order instead
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Estimated delivery */}
      {order.estimatedDelivery && !order.deliveredAt && order.status !== 'cancelled' && !order.delayInfo?.isDelayed && (
        <div className="rounded-md border border-border bg-bg-surface p-4 flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-accent shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-fg-primary">
              Estimated delivery:{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            {order.carrier && (
              <p className="text-xs text-fg-muted">via {order.carrier}</p>
            )}
          </div>
        </div>
      )}

      {order.deliveredAt && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <Check className="h-5 w-5 text-success shrink-0" />
          <p className="text-sm font-medium text-success">
            Delivered on{' '}
            {new Date(order.deliveredAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Packed info — address still changeable */}
      {order.status === 'packed' && order.addressChangeEligible && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-fg-primary">
              Your order is packed and ready to ship
            </p>
            <p className="text-xs text-fg-secondary mt-1">
              Items can no longer be changed, but you can still update the delivery address before the shipping label is printed.
            </p>
          </div>
        </div>
      )}

      {/* Status timeline */}
      <div className="rounded-md border border-border bg-bg-surface p-5">
        <h2 className="font-display text-lg text-fg-primary mb-4">Order Status</h2>
        <StatusTimeline currentStatus={order.status} />
      </div>

      {/* Items */}
      <div className="rounded-md border border-border bg-bg-surface p-5">
        <h2 className="font-display text-lg text-fg-primary mb-4">
          Items ({order.items.length})
        </h2>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
              <div className="h-16 w-16 shrink-0 rounded-md border border-border overflow-hidden bg-bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fg-primary truncate">{item.name}</p>
                {item.variant && (
                  <p className="text-xs text-fg-muted">{item.variant}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-fg-secondary">Qty: {item.quantity}</p>
                  {item.availability && item.availability !== 'in_stock' && (
                    <Badge variant={availabilityConfig[item.availability].variant} className="text-[10px] px-1.5 py-0">
                      {availabilityConfig[item.availability].label}
                      {item.estimatedRestockDate && (
                        <> — est. {new Date(item.estimatedRestockDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-fg-primary whitespace-nowrap">
                {(item.unitPrice * item.quantity).toLocaleString('da-DK')} {item.currency}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-border space-y-1">
          <div className="flex justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span>{order.totals.subtotal.toLocaleString('da-DK')} {order.totals.currency}</span>
          </div>
          <div className="flex justify-between text-sm text-fg-secondary">
            <span>Shipping</span>
            <span>{order.totals.shipping === 0 ? 'Free' : `${order.totals.shipping} ${order.totals.currency}`}</span>
          </div>
          {order.totals.discount !== 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Discount</span>
              <span>{order.totals.discount.toLocaleString('da-DK')} {order.totals.currency}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium text-fg-primary pt-2 border-t border-border">
            <span>Total</span>
            <span>{order.totals.total.toLocaleString('da-DK')} {order.totals.currency}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-md border border-border bg-bg-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-fg-primary">Shipping Address</h2>
          {order.addressChangeEligible && (
            <Link href={`/order/${order.id}/change`}>
              <Button size="sm" variant="ghost">Edit</Button>
            </Link>
          )}
        </div>
        <address className="text-sm text-fg-secondary not-italic leading-relaxed">
          {order.shippingAddress.name}<br />
          {order.shippingAddress.street}<br />
          {order.shippingAddress.street2 && <>{order.shippingAddress.street2}<br /></>}
          {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
          {order.shippingAddress.country}
          {order.shippingAddress.phone && <><br />{order.shippingAddress.phone}</>}
        </address>
      </div>

      {/* Payment */}
      <div className="rounded-md border border-border bg-bg-surface p-5">
        <h2 className="font-display text-lg text-fg-primary mb-3">Payment</h2>
        <p className="text-sm text-fg-secondary">{order.paymentMethod}</p>
        <p className="text-xs text-fg-muted capitalize mt-1">
          Status: {order.paymentStatus.replace('_', ' ')}
        </p>
      </div>

      {/* Actions */}
      <OrderActions order={order} />
    </div>
  )
}
