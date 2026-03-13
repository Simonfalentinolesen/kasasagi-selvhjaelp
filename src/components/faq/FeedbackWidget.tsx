'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

interface FeedbackWidgetProps {
  articleSlug: string
  className?: string
}

export function FeedbackWidget({ articleSlug, className }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleFeedback(type: 'up' | 'down') {
    setFeedback(type)
    setSubmitted(true)
    // In production, this would send to an API
    console.log(`Feedback for ${articleSlug}: ${type}`)
  }

  if (submitted) {
    return (
      <div className={cn('rounded-md border border-border bg-bg-surface p-4 text-center', className)}>
        <p className="text-sm text-fg-secondary">
          {feedback === 'up'
            ? 'Thanks for your feedback!'
            : 'Sorry this wasn\'t helpful. We\'ll work on improving it.'}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-md border border-border bg-bg-surface p-4', className)}>
      <p className="text-sm font-medium text-fg-primary text-center mb-3">
        Was this article helpful?
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleFeedback('up')}
          icon={<ThumbsUp className="h-4 w-4" />}
        >
          Yes
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleFeedback('down')}
          icon={<ThumbsDown className="h-4 w-4" />}
        >
          No
        </Button>
      </div>
    </div>
  )
}
