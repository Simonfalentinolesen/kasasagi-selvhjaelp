'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { TrackingInfo } from '@/types/tracking'

export function useTracking(orderId: string) {
  const [tracking, setTracking] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTracking = useCallback(async () => {
    try {
      const data = await api.getTracking(orderId)
      setTracking(data)
      setError(null)
    } catch {
      setError('Tracking information is not available yet.')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchTracking()
  }, [fetchTracking])

  return { tracking, loading, error, refetch: fetchTracking }
}
