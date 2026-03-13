'use client'

import { useOrderStore } from '@/stores/order-store'
import { OrderDetails } from '@/components/order/OrderDetails'

export default function OrderPage() {
  const order = useOrderStore((s) => s.currentOrder)

  if (!order) return null

  return <OrderDetails order={order} />
}
