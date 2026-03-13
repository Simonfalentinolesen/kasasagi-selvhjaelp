'use client'

import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

interface ProgressBarProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressBar({ steps, currentStep, className }: ProgressBarProps) {
  return (
    <div className={cn('flex items-center', className)} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={steps.length}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isCompleted && 'bg-accent text-white',
                  isCurrent && 'bg-accent text-white ring-4 ring-blue-100',
                  !isCompleted && !isCurrent && 'bg-bg-surface-2 text-fg-muted'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs whitespace-nowrap',
                  isCurrent ? 'text-fg-primary font-medium' : 'text-fg-muted'
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors',
                  isCompleted ? 'bg-accent' : 'bg-bg-surface-2'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
