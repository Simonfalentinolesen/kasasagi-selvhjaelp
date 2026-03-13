'use client'

import { useTracking } from '@/hooks/useTracking'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { MapPin, ExternalLink, RefreshCw, Clock, Package } from 'lucide-react'

interface TrackingEventsProps {
  orderId: string
}

export function TrackingEvents({ orderId }: TrackingEventsProps) {
  const { tracking, loading, error, refetch } = useTracking(orderId)

  if (loading) return <SkeletonLoader lines={5} />

  if (error || !tracking) {
    return (
      <div className="rounded-md border border-border bg-bg-surface p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface-2">
          <Package className="h-6 w-6 text-fg-muted" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-base font-medium text-fg-primary">Tracking is on its way</h3>
          <p className="text-sm text-fg-secondary mt-1 max-w-xs mx-auto">
            Your order is being prepared. Tracking details will appear here once your package has been handed to the carrier — usually within 1–2 business days.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetch} icon={<RefreshCw className="h-3.5 w-3.5" />}>
          Check again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl text-fg-primary">Tracking Details</h2>
          <p className="text-sm text-fg-secondary mt-1">
            {tracking.carrier} &middot;{' '}
            <span className="font-mono">{tracking.trackingNumber}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={refetch} icon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
          {tracking.trackingUrl && (
            <a href={tracking.trackingUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" icon={<ExternalLink className="h-3.5 w-3.5" />}>
                Carrier
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Estimated delivery */}
      {tracking.estimatedDelivery && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-bg-surface p-4">
          <Clock className="h-5 w-5 text-accent shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-fg-primary">
              Estimated delivery:{' '}
              {new Date(tracking.estimatedDelivery).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Events */}
      <div className="rounded-md border border-border bg-bg-surface p-5">
        <h3 className="text-sm font-medium text-fg-primary mb-4">Tracking History</h3>
        <div className="space-y-0">
          {tracking.events.map((event, i) => {
            const isFirst = i === 0
            return (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      isFirst ? 'bg-accent text-white' : 'bg-bg-surface-2 text-fg-muted'
                    )}
                  >
                    {isFirst ? (
                      <Package className="h-3 w-3" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                  {i < tracking.events.length - 1 && (
                    <div className="w-px flex-1 min-h-[20px] bg-border" />
                  )}
                </div>
                <div className="pb-5 last:pb-0">
                  <p className={cn('text-sm', isFirst ? 'font-medium text-fg-primary' : 'text-fg-secondary')}>
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-fg-muted">
                      {new Date(event.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {event.location && (
                      <>
                        <span className="text-xs text-fg-muted">&middot;</span>
                        <span className="flex items-center gap-0.5 text-xs text-fg-muted">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
