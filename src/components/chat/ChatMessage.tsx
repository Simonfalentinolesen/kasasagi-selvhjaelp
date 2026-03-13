'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/types/chat'
import { cn } from '@/lib/cn'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2.5', isBot ? 'justify-start' : 'justify-end')}
    >
      {isBot && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
          isBot
            ? 'bg-bg-surface-2 text-fg-primary rounded-tl-sm'
            : 'bg-accent text-white rounded-tr-sm'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.actions && message.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.actions.map((action) => (
              <button
                key={action.label}
                className="rounded-md border border-accent/30 bg-white/80 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/5 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fg-muted/10 text-fg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-xl rounded-tl-sm bg-bg-surface-2 px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-fg-muted/40"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
