import type { Address } from './order'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  avatarUrl?: string
}

export interface SavedAddress {
  id: string
  label: string
  isDefault: boolean
  name: string
  street: string
  street2?: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface EmailPreferences {
  orderUpdates: boolean
  marketing: boolean
  newsletters: boolean
  productReviews: boolean
  priceAlerts: boolean
}

export interface UserPreferences {
  emailPreferences: EmailPreferences
  language: string
  currency: string
}

export interface OrderStats {
  totalOrders: number
  openOrders: number
  totalSpent: number
  currency: string
}

export interface UserProfile {
  user: User
  savedAddresses: SavedAddress[]
  preferences: UserPreferences
  orderStats: OrderStats
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
