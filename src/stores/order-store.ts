import { create } from 'zustand'
import type { Order } from '@/types/order'

interface OrderState {
  currentOrder: Order | null
  setCurrentOrder: (order: Order) => void
  clearOrder: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
  clearOrder: () => set({ currentOrder: null }),
}))
