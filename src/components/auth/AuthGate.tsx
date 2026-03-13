'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrderStore } from '@/stores/order-store'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

interface AuthGateProps {
  children: React.ReactNode
  orderId: string
}

export function AuthGate({ children, orderId }: AuthGateProps) {
  const currentOrder = useOrderStore((s) => s.currentOrder)
  const setCurrentOrder = useOrderStore((s) => s.setCurrentOrder)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Order already loaded and matches — nothing to do
    if (currentOrder && currentOrder.id === orderId) {
      return
    }

    // User is logged in — try to fetch the order directly
    if (isAuthenticated) {
      setLoading(true)
      api.getOrder(orderId)
        .then((order) => {
          setCurrentOrder(order)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
          router.replace('/')
        })
      return
    }

    // Not logged in and no order in store — redirect to lookup
    router.replace('/')
  }, [currentOrder, orderId, isAuthenticated, router, setCurrentOrder])

  if (loading) {
    return (
      <div className="space-y-4 py-6">
        <SkeletonLoader className="h-8 w-48" />
        <SkeletonLoader className="h-32 w-full" />
        <SkeletonLoader className="h-48 w-full" />
      </div>
    )
  }

  if (!currentOrder || currentOrder.id !== orderId) {
    return null
  }

  return <>{children}</>
}
