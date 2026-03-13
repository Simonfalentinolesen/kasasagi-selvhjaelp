import { create } from 'zustand'
import type { User } from '@/types/user'

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  token: null,
  login: (user, token) => set({ currentUser: user, isAuthenticated: true, token }),
  logout: () => set({ currentUser: null, isAuthenticated: false, token: null }),
  setUser: (user) => set({ currentUser: user }),
}))
