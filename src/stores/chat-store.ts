import { create } from 'zustand'
import type { ChatMessage } from '@/types/chat'

interface ChatState {
  isOpen: boolean
  sessionId: string
  messages: ChatMessage[]
  isTyping: boolean
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  addMessage: (message: ChatMessage) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
}

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  sessionId: generateSessionId(),
  messages: [],
  isTyping: false,
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () =>
    set({ messages: [], sessionId: generateSessionId() }),
}))
