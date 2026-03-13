import { simulateDelay } from './delay'
import { mockOrders } from './data/orders'
import { mockTracking } from './data/tracking'
import { mockCategories, mockArticles } from './data/faq'
import { findBestResponse } from './data/chat-responses'
import {
  mockUsers,
  mockSavedAddresses,
  mockPreferences,
  mockUserOrders,
  mockCredentials,
} from './data/users'
import type { Order } from '@/types/order'
import type { TrackingInfo } from '@/types/tracking'
import type { FAQCategory, FAQArticle, FAQSearchResult } from '@/types/faq'
import type {
  ReturnRequest, ReturnResponse,
  CancelRequest, CancelResponse,
  ClaimRequest, ClaimResponse,
  ChangeRequest, ChangeResponse,
  QuestionRequest, QuestionResponse,
} from '@/types/flow'
import type { ChatMessage, ChatAction } from '@/types/chat'
import type {
  User,
  UserProfile,
  UserPreferences,
  SavedAddress,
  LoginResponse,
} from '@/types/user'

let idCounter = 100

function nextId(prefix: string) {
  return `${prefix}_${++idCounter}`
}

// In-memory "current user" for mock — set on login
let currentMockUserId: string | null = null

export const mockApi = {
  async lookupOrder(orderNumber: string, email: string): Promise<Order> {
    await simulateDelay()
    if (orderNumber === '9999' || orderNumber === 'KAS-9999') {
      throw { status: 500, message: 'Internal server error' }
    }
    const normalized = orderNumber.replace('#', '').toUpperCase()
    const order = mockOrders.find(
      (o) => o.orderNumber.toUpperCase() === normalized && o.email.toLowerCase() === email.toLowerCase()
    )
    if (!order) {
      throw { status: 404, message: 'Order not found' }
    }
    return order
  },

  async getOrder(orderId: string): Promise<Order> {
    await simulateDelay(200, 500)
    const order = mockOrders.find((o) => o.id === orderId)
    if (!order) throw { status: 404, message: 'Order not found' }
    return order
  },

  async getTracking(orderId: string): Promise<TrackingInfo> {
    await simulateDelay(200, 600)
    const tracking = mockTracking[orderId]
    if (!tracking) throw { status: 404, message: 'Tracking not available' }
    return tracking
  },

  async submitReturn(_orderId: string, _data: ReturnRequest): Promise<ReturnResponse> {
    await simulateDelay(500, 1200)
    return {
      returnId: nextId('ret'),
      returnNumber: `RET-${Math.floor(10000 + Math.random() * 90000)}`,
      labelUrl: 'https://example.com/return-label.pdf',
      instructions: [
        'Pack the item(s) securely in the original packaging',
        'Attach the return label to the outside of the package',
        'Drop off the package at your nearest PostNord pickup point',
        'Keep the receipt as proof of return',
      ],
      estimatedProcessingDays: 5,
    }
  },

  async submitCancel(_orderId: string, _data: CancelRequest): Promise<CancelResponse> {
    await simulateDelay(500, 1000)
    return {
      success: true,
      refundAmount: 1622,
      refundMethod: 'Original payment method',
      estimatedRefundDays: 5,
    }
  },

  async submitClaim(_orderId: string, _data: ClaimRequest): Promise<ClaimResponse> {
    await simulateDelay(600, 1500)
    return {
      claimId: nextId('clm'),
      caseNumber: `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'submitted',
      estimatedResponseDays: 3,
    }
  },

  async submitChange(_orderId: string, _data: ChangeRequest): Promise<ChangeResponse> {
    await simulateDelay(400, 1000)
    return {
      changeId: nextId('chg'),
      status: 'submitted',
      estimatedResponseTime: 'Your change is being processed automatically',
    }
  },

  async submitQuestion(_orderId: string, _data: QuestionRequest): Promise<QuestionResponse> {
    await simulateDelay(300, 800)
    return {
      ticketId: nextId('tkt'),
      referenceNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedResponseTime: 'Your question has been received and will be reviewed',
    }
  },

  async getFAQCategories(): Promise<FAQCategory[]> {
    await simulateDelay(200, 400)
    return mockCategories
  },

  async getFAQArticlesByCategory(categorySlug: string): Promise<FAQArticle[]> {
    await simulateDelay(200, 400)
    return mockArticles.filter((a) => a.categorySlug === categorySlug)
  },

  async getFAQArticle(articleSlug: string): Promise<FAQArticle> {
    await simulateDelay(200, 400)
    const article = mockArticles.find((a) => a.slug === articleSlug)
    if (!article) throw { status: 404, message: 'Article not found' }
    return article
  },

  async searchFAQ(query: string): Promise<FAQSearchResult[]> {
    await simulateDelay(200, 500)
    const lower = query.toLowerCase()
    return mockArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.content.toLowerCase().includes(lower) ||
          a.excerpt.toLowerCase().includes(lower)
      )
      .map((article) => ({
        article,
        highlight: article.excerpt,
      }))
  },

  async sendChatMessage(
    _sessionId: string,
    message: string,
    orderId?: string
  ): Promise<{ text: string; actions?: ChatAction[] }> {
    await simulateDelay(600, 1500)
    const pattern = findBestResponse(message)
    let text = pattern.response

    if (orderId) {
      const order = mockOrders.find((o) => o.id === orderId)
      if (order) {
        text = text
          .replace('{status}', order.status)
          .replace('{trackingInfo}', order.trackingNumber
            ? `Your tracking number is ${order.trackingNumber}.`
            : 'Tracking information is not yet available.'
          )
      }
    }

    text = text.replace('{status}', 'being processed').replace('{trackingInfo}', '')

    return { text, actions: pattern.actions }
  },

  async uploadFile(_file: File): Promise<string> {
    await simulateDelay(500, 2000)
    return `https://example.com/uploads/${nextId('upload')}.jpg`
  },

  // ── Auth & Profile ──

  async login(email: string, password: string): Promise<LoginResponse> {
    await simulateDelay(400, 800)
    const storedPassword = mockCredentials[email.toLowerCase()]
    if (!storedPassword || storedPassword !== password) {
      throw { status: 401, message: 'Invalid email or password' }
    }
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' }
    }
    currentMockUserId = user.id
    return {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    }
  },

  async getProfile(): Promise<UserProfile> {
    await simulateDelay(200, 500)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const user = mockUsers.find((u) => u.id === currentMockUserId)
    if (!user) throw { status: 401, message: 'User not found' }

    const orderIds = mockUserOrders[currentMockUserId] || []
    const userOrders = mockOrders.filter((o) => orderIds.includes(o.id))
    const openStatuses = ['pending', 'confirmed', 'packed', 'shipped']

    return {
      user,
      savedAddresses: mockSavedAddresses[currentMockUserId] || [],
      preferences: mockPreferences[currentMockUserId] || {
        emailPreferences: {
          orderUpdates: true,
          marketing: false,
          newsletters: false,
          productReviews: false,
          priceAlerts: false,
        },
        language: 'en',
        currency: 'DKK',
      },
      orderStats: {
        totalOrders: userOrders.length,
        openOrders: userOrders.filter((o) => openStatuses.includes(o.status)).length,
        totalSpent: userOrders.reduce((sum, o) => sum + o.totals.total, 0),
        currency: 'DKK',
      },
    }
  },

  async getUserOrders(): Promise<Order[]> {
    await simulateDelay(200, 500)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const orderIds = mockUserOrders[currentMockUserId] || []
    return mockOrders.filter((o) => orderIds.includes(o.id))
  },

  async updatePersonalInfo(data: { firstName: string; lastName: string; phone?: string }): Promise<User> {
    await simulateDelay(300, 600)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const user = mockUsers.find((u) => u.id === currentMockUserId)
    if (!user) throw { status: 404, message: 'User not found' }

    // Mutate in-memory mock
    Object.assign(user, data)
    return { ...user }
  },

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    await simulateDelay(300, 600)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const current = mockPreferences[currentMockUserId]
    if (!current) throw { status: 404, message: 'Preferences not found' }

    if (prefs.emailPreferences) {
      Object.assign(current.emailPreferences, prefs.emailPreferences)
    }
    if (prefs.language) current.language = prefs.language
    if (prefs.currency) current.currency = prefs.currency

    return { ...current }
  },

  async addAddress(address: Omit<SavedAddress, 'id'>): Promise<SavedAddress> {
    await simulateDelay(300, 600)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const newAddress: SavedAddress = {
      ...address,
      id: nextId('addr'),
    }

    if (!mockSavedAddresses[currentMockUserId]) {
      mockSavedAddresses[currentMockUserId] = []
    }

    // If new address is default, unset others
    if (newAddress.isDefault) {
      mockSavedAddresses[currentMockUserId].forEach((a) => (a.isDefault = false))
    }

    mockSavedAddresses[currentMockUserId].push(newAddress)
    return { ...newAddress }
  },

  async updateAddress(addressId: string, data: Partial<SavedAddress>): Promise<SavedAddress> {
    await simulateDelay(300, 600)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const addresses = mockSavedAddresses[currentMockUserId] || []
    const address = addresses.find((a) => a.id === addressId)
    if (!address) throw { status: 404, message: 'Address not found' }

    // If setting as default, unset others
    if (data.isDefault) {
      addresses.forEach((a) => (a.isDefault = false))
    }

    Object.assign(address, data)
    return { ...address }
  },

  async deleteAddress(addressId: string): Promise<void> {
    await simulateDelay(200, 400)
    if (!currentMockUserId) throw { status: 401, message: 'Not authenticated' }

    const addresses = mockSavedAddresses[currentMockUserId]
    if (!addresses) throw { status: 404, message: 'Address not found' }

    const idx = addresses.findIndex((a) => a.id === addressId)
    if (idx === -1) throw { status: 404, message: 'Address not found' }

    addresses.splice(idx, 1)
  },

  /** Set the current mock user (called from login in auth store) */
  setCurrentMockUser(userId: string | null) {
    currentMockUserId = userId
  },
}
