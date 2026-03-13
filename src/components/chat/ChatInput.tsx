'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  className?: string
}

export function ChatInput({ onSend, disabled, className }: ChatInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn('flex items-end gap-2 border-t border-border p-3', className)}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
        className={cn(
          'flex-1 resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm',
          'placeholder:text-fg-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'max-h-24'
        )}
        aria-label="Chat message"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          'bg-accent text-white',
          'hover:bg-accent-hover transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
        )}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
}
