'use client'

import { useState, useMemo } from 'react'
import { OrderCard } from '@/components/order/OrderCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Order } from '@/types/order'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { ShoppingBag } from 'lucide-react'

type Tab = 'all' | 'open' | 'completed'

interface OrderHistoryListProps {
  orders: Order[]
}

const openStatuses = ['pending', 'confirmed', 'packed', 'shipped']

export function OrderHistoryList({ orders }: OrderHistoryListProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'open':
        return orders.filter((o) => openStatuses.includes(o.status))
      case 'completed':
        return orders.filter((o) => !openStatuses.includes(o.status))
      default:
        return orders
    }
  }, [orders, activeTab])

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'open', label: 'Open', count: orders.filter((o) => openStatuses.includes(o.status)).length },
    { key: 'completed', label: 'Completed', count: orders.filter((o) => !openStatuses.includes(o.status)).length },
  ]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-3 py-2 text-sm transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-accent text-fg-primary font-medium'
                : 'border-transparent text-fg-secondary hover:text-fg-primary'
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-fg-muted">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Order list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" strokeWidth={1} />}
          title={
            activeTab === 'open'
              ? 'No open orders'
              : activeTab === 'completed'
                ? 'No completed orders yet'
                : 'No orders yet'
          }
          description={
            activeTab === 'open'
              ? 'All your orders have been completed or delivered. When you place a new order, it will show up here.'
              : activeTab === 'completed'
                ? 'Once an order has been delivered, it will appear here so you can manage returns or claims.'
                : 'When you place your first order, you can track it and manage everything from here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link key={order.id} href={`/order/${order.id}`} className="block">
              <OrderCard order={order} className="hover:border-fg-muted transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
