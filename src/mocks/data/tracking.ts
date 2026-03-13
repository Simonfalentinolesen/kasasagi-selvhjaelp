import type { TrackingInfo } from '@/types/tracking'

export const mockTracking: Record<string, TrackingInfo> = {
  // ord_006 — SHIPPED, på vej med GLS
  ord_006: {
    carrier: 'GLS',
    trackingNumber: 'GLS-DK-20260312-7891',
    trackingUrl: 'https://gls-group.com/track/GLS-DK-20260312-7891',
    estimatedDelivery: '2026-03-14',
    events: [
      {
        id: 'evt_61',
        timestamp: '2026-03-13T06:30:00Z',
        status: 'in_transit',
        description: 'Package at local distribution center — out for delivery today',
        location: 'GLS Pakkeshop, København V',
      },
      {
        id: 'evt_62',
        timestamp: '2026-03-12T22:15:00Z',
        status: 'in_transit',
        description: 'In transit to destination',
        location: 'GLS Sortercenter, Taulov',
      },
      {
        id: 'evt_63',
        timestamp: '2026-03-12T16:45:00Z',
        status: 'shipped',
        description: 'Shipment collected by GLS',
        location: 'Kasasagi Warehouse, Odense',
      },
      {
        id: 'evt_64',
        timestamp: '2026-03-12T14:00:00Z',
        status: 'packed',
        description: 'Label printed — package ready for carrier pickup',
        location: 'Kasasagi Warehouse, Odense',
      },
    ],
  },

  // ord_007 — DELIVERED, PostNord
  ord_007: {
    carrier: 'PostNord',
    trackingNumber: 'PN-DK-20260222-4567',
    trackingUrl: 'https://tracking.postnord.com/PN-DK-20260222-4567',
    estimatedDelivery: '2026-02-25',
    events: [
      {
        id: 'evt_71',
        timestamp: '2026-02-25T14:20:00Z',
        status: 'delivered',
        description: 'Package delivered to recipient',
        location: 'København V',
      },
      {
        id: 'evt_72',
        timestamp: '2026-02-25T08:15:00Z',
        status: 'out_for_delivery',
        description: 'Out for delivery',
        location: 'København V',
      },
      {
        id: 'evt_73',
        timestamp: '2026-02-24T22:30:00Z',
        status: 'in_transit',
        description: 'Arrived at local distribution center',
        location: 'PostNord, København',
      },
      {
        id: 'evt_74',
        timestamp: '2026-02-23T16:00:00Z',
        status: 'in_transit',
        description: 'In transit',
        location: 'PostNord, Taulov',
      },
      {
        id: 'evt_75',
        timestamp: '2026-02-22T10:00:00Z',
        status: 'shipped',
        description: 'Package dispatched from warehouse',
        location: 'Kasasagi Warehouse, Odense',
      },
    ],
  },
}
