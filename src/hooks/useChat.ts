'use client'

import { useCallback } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { api } from '@/lib/api'
import { useOrderStore } from '@/stores/order-store'

export function useChat() {
  const store = useChatStore()
  const currentOrder = useOrderStore((s) => s.currentOrder)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || store.isTyping) return

      // Add user message
      store.addMessage({
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      })

      store.setTyping(true)

      try {
        const response = await api.sendChatMessage(
          store.sessionId,
          text.trim(),
          currentOrder?.id
        )

        store.addMessage({
          id: `msg-${Date.now()}-bot`,
          role: 'bot',
          content: response.text,
          timestamp: new Date().toISOString(),
          actions: response.actions,
        })
      } catch {
        store.addMessage({
          id: `msg-${Date.now()}-error`,
          role: 'bot',
          content: 'I wasn\u2019t able to process that. Could you try rephrasing your question? You can also browse our help center at /faq for detailed guides.',
          timestamp: new Date().toISOString(),
        })
      } finally {
        store.setTyping(false)
      }
    },
    [store, currentOrder]
  )

  return {
    messages: store.messages,
    isTyping: store.isTyping,
    isOpen: store.isOpen,
    sendMessage,
    toggleChat: store.toggleChat,
    openChat: store.openChat,
    closeChat: store.closeChat,
    clearMessages: store.clearMessages,
  }
}
