'use client'

import type { OrderStats } from '@/types/user'
import { ShoppingBag, Clock, CreditCard } from 'lucide-react'

interface ProfileStatsProps {
  stats: OrderStats
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    {
      label: 'Total orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
    },
    {
      label: 'Open orders',
      value: stats.openOrders.toString(),
      icon: Clock,
    },
    {
      label: 'Total spent',
      value: `${stats.totalSpent.toLocaleString('da-DK')} ${stats.currency}`,
      icon: CreditCard,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="rounded-md border border-border bg-bg-surface p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
              <span className="text-xs text-fg-muted">{item.label}</span>
            </div>
            <p className="text-lg font-display text-fg-primary">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}
