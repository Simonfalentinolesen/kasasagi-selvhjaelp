'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useOrderStore } from '@/stores/order-store'

type LookupState = 'idle' | 'loading' | 'error'

export function useOrderLookup() {
  const [state, setState] = useState<LookupState>('idle')
  const [error, setError] = useState<string | null>(null)
  const setCurrentOrder = useOrderStore((s) => s.setCurrentOrder)
  const router = useRouter()

  const lookup = async (orderNumber: string, email: string) => {
    setState('loading')
    setError(null)
    try {
      const order = await api.lookupOrder(orderNumber, email)
      setCurrentOrder(order)
      setState('idle')
      router.push(`/order/${order.id}`)
    } catch (err: unknown) {
      setState('error')
      const apiErr = err as { status?: number; message?: string }
      if (apiErr.status === 404) {
        setError(
          "We couldn\u2019t find an order with those details. Please double-check your order number and the email you used at checkout."
        )
      } else if (apiErr.status === 429) {
        setError('You\u2019ve made several attempts. Please wait a few minutes before trying again.')
      } else {
        setError('We couldn\u2019t look up your order right now. Please try again in a moment.')
      }
    }
  }

  return { lookup, state, error }
}
