import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface UIState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  sideNavCollapsed: boolean
  toggleSideNav: () => void
}

let toastId = 0

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: `toast_${++toastId}` }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  sideNavCollapsed: false,
  toggleSideNav: () =>
    set((state) => ({ sideNavCollapsed: !state.sideNavCollapsed })),
}))
