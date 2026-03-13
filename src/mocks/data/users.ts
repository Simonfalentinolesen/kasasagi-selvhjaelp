import type { User, SavedAddress, UserPreferences, UserProfile } from '@/types/user'

export const mockUsers: User[] = [
  {
    id: 'usr_001',
    email: 'anna@example.com',
    firstName: 'Anna',
    lastName: 'Jensen',
    phone: '+45 28 91 44 02',
    createdAt: '2024-09-15T10:30:00Z',
  },
  {
    id: 'usr_002',
    email: 'mikkel@example.com',
    firstName: 'Mikkel',
    lastName: 'Andersen',
    phone: '+45 31 55 78 90',
    createdAt: '2025-11-02T14:20:00Z',
  },
]

export const mockSavedAddresses: Record<string, SavedAddress[]> = {
  usr_001: [
    {
      id: 'addr_001',
      label: 'Home',
      isDefault: true,
      name: 'Anna Jensen',
      street: 'Vesterbrogade 42, 3. th',
      city: 'København V',
      postalCode: '1620',
      country: 'Denmark',
      phone: '+45 28 91 44 02',
    },
    {
      id: 'addr_002',
      label: 'Office',
      isDefault: false,
      name: 'Anna Jensen',
      street: 'Landemærket 11, 4. sal',
      city: 'København K',
      postalCode: '1119',
      country: 'Denmark',
      phone: '+45 28 91 44 02',
    },
  ],
  usr_002: [
    {
      id: 'addr_003',
      label: 'Home',
      isDefault: true,
      name: 'Mikkel Andersen',
      street: 'Nørrebrogade 88, 2. tv',
      city: 'København N',
      postalCode: '2200',
      country: 'Denmark',
      phone: '+45 31 55 78 90',
    },
  ],
}

export const mockPreferences: Record<string, UserPreferences> = {
  usr_001: {
    emailPreferences: {
      orderUpdates: true,
      marketing: true,
      newsletters: true,
      productReviews: false,
      priceAlerts: true,
    },
    language: 'da',
    currency: 'DKK',
  },
  usr_002: {
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
}

/** Map user ID → order IDs they own */
export const mockUserOrders: Record<string, string[]> = {
  usr_001: ['ord_001', 'ord_002', 'ord_003', 'ord_004', 'ord_005', 'ord_006', 'ord_007'],
  usr_002: [],
}

export const mockCredentials: Record<string, string> = {
  'anna@example.com': 'password123',
  'mikkel@example.com': 'password123',
}

export function getMockUserProfile(userId: string): UserProfile | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  const orderIds = mockUserOrders[userId] || []
  const openStatuses = ['pending', 'confirmed', 'packed', 'shipped']

  // We'll compute stats lazily — import orders inline to avoid circular deps
  return {
    user,
    savedAddresses: mockSavedAddresses[userId] || [],
    preferences: mockPreferences[userId] || {
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
      totalOrders: orderIds.length,
      openOrders: 0, // Computed in handler with actual order data
      totalSpent: 0,  // Computed in handler with actual order data
      currency: 'DKK',
    },
  }
}
