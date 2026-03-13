'use client'

import { useUserOrders } from '@/hooks/useProfile'
import { OrderHistoryList } from '@/components/profile/OrderHistoryList'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

export default function ProfileOrdersPage() {
  const { orders, loading } = useUserOrders()

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-fg-primary">Your Orders</h1>
      {loading ? (
        <div className="space-y-3">
          <SkeletonLoader className="h-10 w-64" />
          <SkeletonLoader className="h-24 w-full" />
          <SkeletonLoader className="h-24 w-full" />
          <SkeletonLoader className="h-24 w-full" />
        </div>
      ) : (
        <OrderHistoryList orders={orders} />
      )}
    </div>
  )
}
