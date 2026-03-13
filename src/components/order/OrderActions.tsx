'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Order } from '@/types/order'
import {
  MapPin, RotateCcw, XCircle, AlertTriangle, PenLine, MessageCircle, ExternalLink, Package,
  ShieldCheck, BookOpen, Wrench,
} from 'lucide-react'

interface OrderActionsProps {
  order: Order
}

export function OrderActions({ order }: OrderActionsProps) {
  const hasReturnableItems = order.items.some((item) => item.returnable)
  const isDelivered = order.status === 'delivered'
  const isShipped = order.status === 'shipped'
  const isCancelled = order.status === 'cancelled'
  const isReturned = order.status === 'returned'
  const canChangeAnything = order.contentChangeEligible || order.addressChangeEligible

  if (isCancelled || isReturned) return null

  return (
    <div className="rounded-md border border-border bg-bg-surface p-5">
      <h2 className="font-display text-lg text-fg-primary mb-4">What would you like to do?</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {(isShipped || order.trackingNumber) && (
          <Link href={`/order/${order.id}/tracking`}>
            <Button variant="primary" icon={<MapPin className="h-4 w-4" />} className="w-full justify-start">
              Track package
            </Button>
          </Link>
        )}

        {hasReturnableItems && (isDelivered || isShipped) && (
          <Link href={`/order/${order.id}/return`}>
            <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} className="w-full justify-start">
              Start a return
            </Button>
          </Link>
        )}

        {order.cancelEligible && (
          <Link href={`/order/${order.id}/cancel`}>
            <Button variant="secondary" icon={<XCircle className="h-4 w-4" />} className="w-full justify-start">
              Cancel order
            </Button>
          </Link>
        )}

        <Link href={`/order/${order.id}/claim`}>
          <Button variant="secondary" icon={<AlertTriangle className="h-4 w-4" />} className="w-full justify-start">
            Report an issue
          </Button>
        </Link>

        {canChangeAnything && (
          <Link href={`/order/${order.id}/change`}>
            <Button variant="secondary" icon={<PenLine className="h-4 w-4" />} className="w-full justify-start">
              {order.contentChangeEligible && order.addressChangeEligible
                ? 'Change order'
                : order.addressChangeEligible
                  ? 'Change delivery address'
                  : 'Change order items'}
            </Button>
          </Link>
        )}

        {!canChangeAnything && !isDelivered && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-surface-2 text-fg-muted text-sm">
            <Package className="h-4 w-4 shrink-0" />
            <span>Order can no longer be modified</span>
          </div>
        )}

        <Link href={`/order/${order.id}/question`}>
          <Button variant="ghost" icon={<MessageCircle className="h-4 w-4" />} className="w-full justify-start">
            Ask a question
          </Button>
        </Link>

        {order.trackingUrl && (
          <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" icon={<ExternalLink className="h-4 w-4" />} className="w-full justify-start">
              Carrier tracking page
            </Button>
          </a>
        )}
      </div>

      {/* Self-service resources section */}
      {isDelivered && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-fg-secondary mb-3">Resources for your order</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/faq/warranty">
              <Button variant="ghost" size="sm" icon={<ShieldCheck className="h-4 w-4" />} className="w-full justify-start text-fg-muted">
                Warranty information
              </Button>
            </Link>
            <Link href="/faq/materials">
              <Button variant="ghost" size="sm" icon={<BookOpen className="h-4 w-4" />} className="w-full justify-start text-fg-muted">
                Care guides
              </Button>
            </Link>
            <Link href="/faq/furniture">
              <Button variant="ghost" size="sm" icon={<Wrench className="h-4 w-4" />} className="w-full justify-start text-fg-muted">
                Assembly & troubleshooting
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
