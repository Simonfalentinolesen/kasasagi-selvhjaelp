export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type ItemAvailability = 'in_stock' | 'delayed' | 'backordered' | 'discontinued'

export interface Address {
  name: string
  street: string
  street2?: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  variant?: string
  imageUrl: string
  quantity: number
  unitPrice: number
  currency: string
  returnable: boolean
  returnDeadline?: string
  /** Item-level availability — relevant for delay/partial delivery scenarios */
  availability?: ItemAvailability
  /** Expected restock date when item is delayed/backordered */
  estimatedRestockDate?: string
}

export interface OrderTotals {
  subtotal: number
  shipping: number
  discount: number
  total: number
  currency: string
}

export interface DelayInfo {
  /** Whether the order is currently delayed */
  isDelayed: boolean
  /** Human-readable reason for the delay */
  reason: string
  /** Original estimated delivery before the delay */
  originalEstimatedDelivery: string
  /** New estimated delivery after the delay */
  newEstimatedDelivery: string
  /** Whether partial delivery is available (some items in stock) */
  partialDeliveryAvailable: boolean
  /** Items that can be shipped now (their IDs) */
  availableItemIds?: string[]
}

export interface Order {
  id: string
  orderNumber: string
  email: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  estimatedDelivery: string | null
  deliveredAt: string | null
  shippingAddress: Address
  items: OrderItem[]
  totals: OrderTotals
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'partially_refunded'
  carrier: string | null
  trackingNumber: string | null
  trackingUrl: string | null
  cancelEligible: boolean
  /** Can the customer change the order content (remove items, change variants)? */
  contentChangeEligible: boolean
  /** Can the customer change the delivery address? */
  addressChangeEligible: boolean
  /** Delay information — present when order has a known delay */
  delayInfo?: DelayInfo
}
