'use client'

import { AuthGate } from '@/components/auth/AuthGate'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { useOrderStore } from '@/stores/order-store'
import { useParams } from 'next/navigation'

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const orderId = params.orderId as string
  const order = useOrderStore((s) => s.currentOrder)

  return (
    <AuthGate orderId={orderId}>
      <div className="flex gap-6">
        <SideNav
          orderId={orderId}
          cancelEligible={order?.cancelEligible}
          changeEligible={order?.contentChangeEligible || order?.addressChangeEligible}
          className="hidden md:flex w-48 shrink-0"
        />
        <div className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </div>
      </div>
      <BottomNav orderId={orderId} />
    </AuthGate>
  )
}
