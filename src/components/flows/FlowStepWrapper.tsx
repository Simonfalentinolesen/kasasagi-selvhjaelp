'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'

interface FlowStepWrapperProps {
  title: string
  steps: string[]
  currentStep: number
  onBack?: () => void
  children: React.ReactNode
  className?: string
}

export function FlowStepWrapper({
  title,
  steps,
  currentStep,
  onBack,
  children,
  className,
}: FlowStepWrapperProps) {
  const router = useRouter()

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl text-fg-primary">{title}</h1>
        <Button
          variant="ghost"
          size="sm"
          icon={<X className="h-4 w-4" />}
          onClick={() => router.back()}
          aria-label="Cancel and go back"
        >
          Cancel
        </Button>
      </div>

      <ProgressBar steps={steps} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {currentStep > 0 && onBack && (
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={onBack}
        >
          Back
        </Button>
      )}
    </div>
  )
}
