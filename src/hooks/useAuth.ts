'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api'

export function useAuth() {
  const { currentUser, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.login(email, password)
      storeLogin(response.user, response.token)
      return response.user
    } catch (err: any) {
      const message = err?.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [storeLogin])

  const logout = useCallback(() => {
    storeLogout()
  }, [storeLogout])

  return {
    user: currentUser,
    isAuthenticated,
    login,
    logout,
    loading,
    error,
  }
}
