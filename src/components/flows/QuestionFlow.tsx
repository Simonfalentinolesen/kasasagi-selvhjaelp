'use client'

import { useState } from 'react'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FlowStepWrapper } from './FlowStepWrapper'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { QUESTION_CATEGORIES } from '@/lib/constants'
import type { QuestionResponse } from '@/types/flow'
import { CheckCircle, ArrowRight } from 'lucide-react'

const STEPS = ['Category', 'Your message', 'Confirmation']

export function QuestionFlow() {
  const params = useParams()
  const router = useRouter()
  const order = useOrderStore((s) => s.currentOrder)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(0)
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuestionResponse | null>(null)

  if (!order) return null

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.submitQuestion(order.id, {
        orderId: order.id,
        category,
        message,
      })
      setResult(res)
      setStep(2)
      addToast({ type: 'success', message: 'Your question has been sent.' })
    } catch {
      addToast({ type: 'error', message: 'Your question couldn\u2019t be sent. Please try again, or check our help center for answers.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowStepWrapper
      title="Ask a Question"
      steps={STEPS}
      currentStep={step}
      onBack={step === 1 ? () => setStep(0) : undefined}
    >
      {/* Step 0: Category */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">What is your question about?</p>
          <Select
            label="Category"
            options={QUESTION_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            placeholder="Select a category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Button onClick={() => setStep(1)} disabled={!category} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 1: Message */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">
            Your question about order {order.orderNumber}:
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question here... (minimum 10 characters)"
            rows={6}
            className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 resize-none"
          />
          <p className="text-xs text-fg-muted">{message.length} characters</p>
          <Button onClick={handleSubmit} loading={loading} disabled={message.length < 10} className="w-full">
            Send question
          </Button>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && result && (
        <div className="text-center space-y-4 py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="font-display text-xl text-fg-primary">Question sent</h2>
            <p className="text-sm text-fg-secondary mt-1">
              Reference: <span className="font-mono font-medium">{result.referenceNumber}</span>
            </p>
          </div>
          <p className="text-sm text-fg-muted">
            You will receive an automated response by email. In the meantime,
            you may find the answer in our{' '}
            <a href="/faq" className="text-accent hover:underline">help articles</a>.
          </p>
          <Button variant="ghost" onClick={() => router.push(`/order/${params.orderId as string}`)} className="w-full">
            Back to order
          </Button>
        </div>
      )}
    </FlowStepWrapper>
  )
}
