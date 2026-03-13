'use client'

import { useParams } from 'next/navigation'
import { TrackingEvents } from '@/components/order/TrackingEvents'

export default function TrackingPage() {
  const params = useParams()
  const orderId = params.orderId as string

  return <TrackingEvents orderId={orderId} />
}
