'use client'

import { HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface EscalationPromptProps {
  onEscalate: () => void
  onDismiss: () => void
}

export function EscalationPrompt({ onEscalate, onDismiss }: EscalationPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-3 mb-2 rounded-lg border border-accent/20 bg-accent/5 p-3"
    >
      <div className="flex items-start gap-2.5">
        <HelpCircle className="h-5 w-5 shrink-0 text-accent mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-fg-primary font-medium">
            Still need help?
          </p>
          <p className="text-xs text-fg-secondary">
            You can submit a detailed question and we&apos;ll look into it. You can also browse our help articles for quick answers.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={onEscalate}>
              Submit a question
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              No thanks
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
