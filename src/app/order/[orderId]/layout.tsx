'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
          <Link
            href="/profile/orders"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-primary transition-colors mb-4 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to My Orders
          </Link>
          {children}
        </div>
      </div>
      <BottomNav orderId={orderId} />
    </AuthGate>
  )
}
