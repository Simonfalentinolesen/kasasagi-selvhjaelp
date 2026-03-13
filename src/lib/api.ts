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
import type { ChatAction } from '@/types/chat'
import type {
  User,
  UserProfile,
  UserPreferences,
  SavedAddress,
  LoginResponse,
} from '@/types/user'

const USE_MOCKS = process.env.NEXT_PUBLIC_MOCK_API === 'true'

async function getMockApi() {
  const { mockApi } = await import('@/mocks/handlers')
  return mockApi
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw { status: res.status, message: error.message || 'Request failed' }
  }
  return res.json()
}

export const api = {
  async lookupOrder(orderNumber: string, email: string): Promise<Order> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.lookupOrder(orderNumber, email)
    }
    return fetchApi('/api/orders/lookup', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, email }),
    })
  },

  async getOrder(orderId: string): Promise<Order> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getOrder(orderId)
    }
    return fetchApi(`/api/orders/${orderId}`)
  },

  async getTracking(orderId: string): Promise<TrackingInfo> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getTracking(orderId)
    }
    return fetchApi(`/api/orders/${orderId}/tracking`)
  },

  async submitReturn(orderId: string, data: ReturnRequest): Promise<ReturnResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.submitReturn(orderId, data)
    }
    return fetchApi('/api/returns', {
      method: 'POST',
      body: JSON.stringify({ ...data, orderId }),
    })
  },

  async submitCancel(orderId: string, data: CancelRequest): Promise<CancelResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.submitCancel(orderId, data)
    }
    return fetchApi(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async submitClaim(orderId: string, data: ClaimRequest): Promise<ClaimResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.submitClaim(orderId, data)
    }
    return fetchApi('/api/claims', {
      method: 'POST',
      body: JSON.stringify({ ...data, orderId }),
    })
  },

  async submitChange(orderId: string, data: ChangeRequest): Promise<ChangeResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.submitChange(orderId, data)
    }
    return fetchApi(`/api/orders/${orderId}/change`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async submitQuestion(orderId: string, data: QuestionRequest): Promise<QuestionResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.submitQuestion(orderId, data)
    }
    return fetchApi('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...data, orderId }),
    })
  },

  async getFAQCategories(): Promise<FAQCategory[]> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getFAQCategories()
    }
    return fetchApi('/api/faq/categories')
  },

  async getFAQArticlesByCategory(categorySlug: string): Promise<FAQArticle[]> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getFAQArticlesByCategory(categorySlug)
    }
    return fetchApi(`/api/faq?category=${categorySlug}`)
  },

  async getFAQArticle(articleSlug: string): Promise<FAQArticle> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getFAQArticle(articleSlug)
    }
    return fetchApi(`/api/faq/articles/${articleSlug}`)
  },

  async searchFAQ(query: string): Promise<FAQSearchResult[]> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.searchFAQ(query)
    }
    return fetchApi(`/api/faq/search?q=${encodeURIComponent(query)}`)
  },

  async sendChatMessage(
    sessionId: string,
    message: string,
    orderId?: string
  ): Promise<{ text: string; actions?: ChatAction[] }> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.sendChatMessage(sessionId, message, orderId)
    }
    return fetchApi('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message, orderId }),
    })
  },

  async uploadFile(file: File): Promise<string> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.uploadFile(file)
    }
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw { status: res.status, message: 'Upload failed' }
    const data = await res.json()
    return data.url
  },

  // ── Auth & Profile ──

  async login(email: string, password: string): Promise<LoginResponse> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.login(email, password)
    }
    return fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async getProfile(): Promise<UserProfile> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getProfile()
    }
    return fetchApi('/api/profile')
  },

  async getUserOrders(): Promise<Order[]> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.getUserOrders()
    }
    return fetchApi('/api/profile/orders')
  },

  async updatePersonalInfo(data: { firstName: string; lastName: string; phone?: string }): Promise<User> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.updatePersonalInfo(data)
    }
    return fetchApi('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.updatePreferences(prefs)
    }
    return fetchApi('/api/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    })
  },

  async addAddress(address: Omit<SavedAddress, 'id'>): Promise<SavedAddress> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.addAddress(address)
    }
    return fetchApi('/api/profile/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    })
  },

  async updateAddress(addressId: string, address: Partial<SavedAddress>): Promise<SavedAddress> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.updateAddress(addressId, address)
    }
    return fetchApi(`/api/profile/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(address),
    })
  },

  async deleteAddress(addressId: string): Promise<void> {
    if (USE_MOCKS) {
      const mock = await getMockApi()
      return mock.deleteAddress(addressId)
    }
    return fetchApi(`/api/profile/addresses/${addressId}`, {
      method: 'DELETE',
    })
  },
}
