'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ChatMessage, TypingIndicator } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { EscalationPrompt } from './EscalationPrompt'
import { cn } from '@/lib/cn'

interface ChatWindowProps {
  className?: string
}

export function ChatWindow({ className }: ChatWindowProps) {
  const { messages, isTyping, isOpen, sendMessage, closeChat, clearMessages } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showEscalation, setShowEscalation] = useState(false)

  // Show escalation after 5 messages from user
  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === 'user')
    if (userMessages.length >= 5 && !showEscalation) {
      setShowEscalation(true)
    }
  }, [messages, showEscalation])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Trap focus and handle Escape
  const windowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeChat()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeChat])

  const handleEscalate = useCallback(() => {
    sendMessage('I need more help with my issue.')
    setShowEscalation(false)
  }, [sendMessage])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={windowRef}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-24 right-6 z-50 flex flex-col',
            'w-[360px] max-h-[520px] rounded-2xl',
            'border border-border bg-bg-surface shadow-xl',
            'sm:w-[400px]',
            className
          )}
          role="dialog"
          aria-label="Chat support"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-fg-primary">Kasasagi Support</h2>
              <p className="text-xs text-fg-muted">Ask us anything</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearMessages}
                className="rounded-md p-1.5 text-fg-muted hover:text-fg-primary hover:bg-bg-surface-2 transition-colors"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={closeChat}
                className="rounded-md p-1.5 text-fg-muted hover:text-fg-primary hover:bg-bg-surface-2 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-fg-muted">
                  Hi! How can we help you today?
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Escalation */}
          {showEscalation && (
            <EscalationPrompt
              onEscalate={handleEscalate}
              onDismiss={() => setShowEscalation(false)}
            />
          )}

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
