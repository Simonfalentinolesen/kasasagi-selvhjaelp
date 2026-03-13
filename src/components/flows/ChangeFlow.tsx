'use client'

import { useState } from 'react'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FlowStepWrapper } from './FlowStepWrapper'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ChangeResponse } from '@/types/flow'
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react'

const STEPS = ['What to change', 'New details', 'Confirmation']

export function ChangeFlow() {
  const params = useParams()
  const router = useRouter()
  const order = useOrderStore((s) => s.currentOrder)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(0)
  const [changeType, setChangeType] = useState<'address' | 'variant' | 'other'>('address')
  const [details, setDetails] = useState<Record<string, string>>({})
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ChangeResponse | null>(null)

  if (!order) return null

  if (!order.contentChangeEligible && !order.addressChangeEligible) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-xl text-fg-primary">Change Order</h1>
        <div className="rounded-md border border-border bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-fg-primary">Changes are no longer possible</p>
            <p className="text-sm text-fg-secondary mt-1">
              This order has already been {order.status}. Changes can no longer be made at this stage.
              If you need to return or exchange an item, you can do so from your order page after delivery.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.submitChange(order.id, {
        orderId: order.id,
        changeType,
        details,
        comment,
      })
      setResult(res)
      setStep(2)
      addToast({ type: 'success', message: 'Your change request has been submitted.' })
    } catch {
      addToast({ type: 'error', message: 'Your change request couldn\u2019t be submitted right now. Please try again in a moment.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowStepWrapper
      title="Change Order"
      steps={STEPS}
      currentStep={step}
      onBack={step === 1 ? () => setStep(0) : undefined}
    >
      {/* Step 0: What to change */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">What would you like to change?</p>
          <div className="space-y-2">
            {[
              { value: 'address' as const, label: 'Shipping address', desc: 'Change the delivery address' },
              { value: 'variant' as const, label: 'Size or color', desc: 'Change a product variant (subject to availability)' },
              { value: 'other' as const, label: 'Something else', desc: 'Other change request' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                  changeType === opt.value ? 'border-accent bg-blue-50/30' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="changeType"
                  value={opt.value}
                  checked={changeType === opt.value}
                  onChange={() => setChangeType(opt.value)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <div>
                  <p className="text-sm font-medium text-fg-primary">{opt.label}</p>
                  <p className="text-xs text-fg-muted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <Button onClick={() => setStep(1)} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-4">
          {changeType === 'address' && (
            <>
              <p className="text-sm text-fg-secondary">Enter your new shipping address.</p>
              <Input label="Full name" value={details.name || ''} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
              <Input label="Street address" value={details.street || ''} onChange={(e) => setDetails({ ...details, street: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Postal code" value={details.postalCode || ''} onChange={(e) => setDetails({ ...details, postalCode: e.target.value })} />
                <Input label="City" value={details.city || ''} onChange={(e) => setDetails({ ...details, city: e.target.value })} />
              </div>
            </>
          )}
          {changeType === 'variant' && (
            <>
              <p className="text-sm text-fg-secondary">Tell us which item and the new variant you want.</p>
              <Input label="Item name" value={details.item || ''} onChange={(e) => setDetails({ ...details, item: e.target.value })} placeholder="e.g. Sakura Silk Scarf" />
              <Input label="New variant" value={details.variant || ''} onChange={(e) => setDetails({ ...details, variant: e.target.value })} placeholder="e.g. Size M, color: Navy" />
            </>
          )}
          {changeType === 'other' && (
            <>
              <p className="text-sm text-fg-secondary">Please describe what you would like to change.</p>
            </>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Additional notes (optional)"
            rows={3}
            className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 resize-none"
          />
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Submit change request
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
            <h2 className="font-display text-xl text-fg-primary">Change request submitted</h2>
            <p className="text-sm text-fg-secondary mt-1">{result.estimatedResponseTime}</p>
          </div>
          <p className="text-sm text-fg-muted">
            Your change request is being processed. You will receive a confirmation by email.
          </p>
          <Button variant="ghost" onClick={() => router.push(`/order/${params.orderId as string}`)} className="w-full">
            Back to order
          </Button>
        </div>
      )}
    </FlowStepWrapper>
  )
}
