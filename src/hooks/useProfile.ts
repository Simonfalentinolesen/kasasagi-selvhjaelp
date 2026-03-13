'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'
import type { UserProfile, UserPreferences, SavedAddress } from '@/types/user'
import type { Order } from '@/types/order'

export function useProfile() {
  const { isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProfile()
      setProfile(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updatePersonalInfo = useCallback(async (data: { firstName: string; lastName: string; phone?: string }) => {
    const user = await api.updatePersonalInfo(data)
    useAuthStore.getState().setUser(user)
    setProfile((prev) => prev ? { ...prev, user } : null)
    return user
  }, [])

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    const updated = await api.updatePreferences(prefs)
    setProfile((prev) => prev ? { ...prev, preferences: updated } : null)
    return updated
  }, [])

  const addAddress = useCallback(async (address: Omit<SavedAddress, 'id'>) => {
    const newAddr = await api.addAddress(address)
    setProfile((prev) => {
      if (!prev) return null
      let addresses = [...prev.savedAddresses, newAddr]
      if (newAddr.isDefault) {
        addresses = addresses.map((a) => a.id === newAddr.id ? a : { ...a, isDefault: false })
      }
      return { ...prev, savedAddresses: addresses }
    })
    return newAddr
  }, [])

  const updateAddress = useCallback(async (addressId: string, data: Partial<SavedAddress>) => {
    const updated = await api.updateAddress(addressId, data)
    setProfile((prev) => {
      if (!prev) return null
      let addresses = prev.savedAddresses.map((a) => a.id === addressId ? updated : a)
      if (updated.isDefault) {
        addresses = addresses.map((a) => a.id === updated.id ? a : { ...a, isDefault: false })
      }
      return { ...prev, savedAddresses: addresses }
    })
    return updated
  }, [])

  const deleteAddress = useCallback(async (addressId: string) => {
    await api.deleteAddress(addressId)
    setProfile((prev) => {
      if (!prev) return null
      return { ...prev, savedAddresses: prev.savedAddresses.filter((a) => a.id !== addressId) }
    })
  }, [])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updatePersonalInfo,
    updatePreferences,
    addAddress,
    updateAddress,
    deleteAddress,
  }
}

export function useUserOrders() {
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getUserOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}
