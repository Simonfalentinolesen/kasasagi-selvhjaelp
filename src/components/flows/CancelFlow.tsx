'use client'

import { useState } from 'react'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FlowStepWrapper } from './FlowStepWrapper'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import type { CancelResponse } from '@/types/flow'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

const STEPS = ['Warning', 'Reason', 'Confirmation']

const CANCEL_REASONS = [
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'found_elsewhere', label: 'Found it cheaper elsewhere' },
  { value: 'ordered_wrong', label: 'Ordered the wrong item' },
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'other', label: 'Other reason' },
]

export function CancelFlow() {
  const params = useParams()
  const router = useRouter()
  const order = useOrderStore((s) => s.currentOrder)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(0)
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CancelResponse | null>(null)

  if (!order) return null

  if (!order.cancelEligible) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-xl text-fg-primary">Cancel Order</h1>
        <div className="rounded-md border border-border bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-fg-primary">Cancellation is not available</p>
            <p className="text-sm text-fg-secondary mt-1">
              This order has already been {order.status === 'shipped' ? 'shipped' : 'processed'}.
              You can start a return instead.
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => router.push(`/order/${order.id}/return`)}>
          Start a return instead
        </Button>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.submitCancel(order.id, { orderId: order.id, reason, comment })
      setResult(res)
      setStep(2)
      addToast({ type: 'success', message: 'Your order has been cancelled.' })
    } catch {
      addToast({ type: 'error', message: 'Your cancellation couldn\u2019t be processed right now. Please wait a moment and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowStepWrapper
      title="Cancel Order"
      steps={STEPS}
      currentStep={step}
      onBack={step > 0 && step < 2 ? () => setStep(step - 1) : undefined}
    >
      {/* Step 0: Warning */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="rounded-md border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-fg-primary">This action cannot be undone</p>
              <p className="text-sm text-fg-secondary mt-1">
                If you cancel this order, it will be permanently cancelled and you will receive a refund
                to your original payment method.
              </p>
            </div>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-sm font-medium text-fg-primary">Order {order.orderNumber}</p>
            <p className="text-sm text-fg-secondary mt-1">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
              {order.totals.total.toLocaleString('da-DK')} {order.totals.currency}
            </p>
          </div>
          <Button onClick={() => setStep(1)} variant="danger" icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            I want to cancel
          </Button>
        </div>
      )}

      {/* Step 1: Reason */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Please tell us why you are cancelling.</p>
          <Select
            label="Reason for cancellation"
            options={CANCEL_REASONS}
            placeholder="Select a reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {reason === 'other' && (
            <Input
              label="Please describe"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more..."
            />
          )}
          <Button
            onClick={handleSubmit}
            loading={loading}
            variant="danger"
            disabled={!reason}
            className="w-full"
          >
            Confirm cancellation
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
            <h2 className="font-display text-xl text-fg-primary">Order cancelled</h2>
            <p className="text-sm text-fg-secondary mt-1">
              Your order {order.orderNumber} has been cancelled.
            </p>
          </div>
          <div className="rounded-md border border-border bg-bg-surface p-4 text-left">
            <h3 className="text-sm font-medium text-fg-primary mb-2">Refund details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-secondary">Refund amount</span>
                <span className="text-fg-primary font-medium">
                  {result.refundAmount.toLocaleString('da-DK')} DKK
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-secondary">Refund to</span>
                <span className="text-fg-primary">{result.refundMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-secondary">Estimated time</span>
                <span className="text-fg-primary">{result.estimatedRefundDays} business days</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push('/')} className="w-full">
            Back to home
          </Button>
        </div>
      )}
    </FlowStepWrapper>
  )
}
