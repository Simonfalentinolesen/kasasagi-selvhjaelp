export interface TrackingEvent {
  id: string
  timestamp: string
  status: string
  description: string
  location?: string
}

export interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl: string
  estimatedDelivery: string | null
  events: TrackingEvent[]
}
