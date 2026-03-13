'use client'

import { useProfile, useUserOrders } from '@/hooks/useProfile'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { Badge } from '@/components/ui/Badge'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus } from '@/types/order'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, MapPin, Bell, Settings } from 'lucide-react'

const statusVariant: Record<OrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  pending: 'info',
  confirmed: 'info',
  packed: 'info',
  shipped: 'warning',
  delivered: 'success',
  cancelled: 'error',
  returned: 'neutral',
}

const quickLinks = [
  { href: '/profile/orders', label: 'View all orders', icon: ShoppingBag },
  { href: '/profile/addresses', label: 'Manage addresses', icon: MapPin },
  { href: '/profile/preferences', label: 'Email preferences', icon: Bell },
  { href: '/profile/settings', label: 'Account settings', icon: Settings },
]

export default function ProfileDashboard() {
  const { profile, loading } = useProfile()
  const { orders } = useUserOrders()

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-16 w-80" />
        <SkeletonLoader className="h-24 w-full" />
        <SkeletonLoader className="h-48 w-full" />
      </div>
    )
  }

  const openStatuses = ['pending', 'confirmed', 'packed', 'shipped']
  const openOrders = orders.filter((o) => openStatuses.includes(o.status))

  return (
    <div className="space-y-6">
      <ProfileHeader user={profile.user} />
      <ProfileStats stats={profile.orderStats} />

      {/* Open orders */}
      {openOrders.length > 0 && (
        <div className="rounded-md border border-border bg-bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-fg-primary">Open Orders</h2>
            <Link
              href="/profile/orders"
              className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {openOrders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0 hover:bg-bg-surface-2 -mx-2 px-2 rounded transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-fg-primary">{order.orderNumber}</p>
                  <p className="text-xs text-fg-muted">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
                    {order.totals.total.toLocaleString('da-DK')} {order.totals.currency}
                  </p>
                </div>
                <Badge variant={statusVariant[order.status]} className="text-xs">
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-border bg-bg-surface p-4 flex items-center gap-3 hover:bg-bg-surface-2 transition-colors"
            >
              <Icon className="h-5 w-5 text-accent shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-fg-primary">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
