'use client'

import { useState } from 'react'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FlowStepWrapper } from './FlowStepWrapper'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { RETURN_REASONS } from '@/lib/constants'
import type { ReturnResponse } from '@/types/flow'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'

const STEPS = ['Select items', 'Reason', 'Method', 'Review', 'Confirmation']

export function ReturnFlow() {
  const params = useParams()
  const router = useRouter()
  const order = useOrderStore((s) => s.currentOrder)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(0)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [method, setMethod] = useState<'pickup' | 'dropoff' | 'store'>('dropoff')
  const [preferRefund, setPreferRefund] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReturnResponse | null>(null)

  if (!order) return null

  const returnableItems = order.items.filter((item) => item.returnable)

  const toggleItem = (itemId: string) => {
    const next = new Set(selectedItems)
    if (next.has(itemId)) next.delete(itemId)
    else next.add(itemId)
    setSelectedItems(next)
  }

  const canProceedStep0 = selectedItems.size > 0
  const canProceedStep1 = Array.from(selectedItems).every((id) => reasons[id])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.submitReturn(order.id, {
        orderId: order.id,
        items: Array.from(selectedItems).map((itemId) => ({
          itemId,
          quantity: 1,
          reason: reasons[itemId],
          comment: comments[itemId],
        })),
        method,
        preferRefund,
      })
      setResult(res)
      setStep(4)
      addToast({ type: 'success', message: 'Your return has been created successfully.' })
    } catch {
      addToast({ type: 'error', message: 'Your return request couldn\u2019t be submitted. Please check your selections and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowStepWrapper
      title="Start a Return"
      steps={STEPS}
      currentStep={step}
      onBack={step > 0 && step < 4 ? () => setStep(step - 1) : undefined}
    >
      {/* Step 0: Select items */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Select the item(s) you wish to return.</p>
          <div className="space-y-3">
            {order.items.map((item) => {
              const isReturnable = item.returnable
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
                    !isReturnable ? 'opacity-50 bg-bg-surface-2' : 'border-border bg-bg-surface'
                  }`}
                >
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    disabled={!isReturnable}
                  />
                  <div className="h-12 w-12 shrink-0 rounded border border-border overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg-primary truncate">{item.name}</p>
                    {item.variant && <p className="text-xs text-fg-muted">{item.variant}</p>}
                    {!isReturnable && <p className="text-xs text-error mt-0.5">Not eligible for return</p>}
                  </div>
                </div>
              )
            })}
          </div>
          <Button onClick={() => setStep(1)} disabled={!canProceedStep0} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 1: Reason */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Please tell us why you are returning.</p>
          {Array.from(selectedItems).map((itemId) => {
            const item = order.items.find((i) => i.id === itemId)
            if (!item) return null
            return (
              <div key={itemId} className="rounded-md border border-border p-4 space-y-3">
                <p className="text-sm font-medium text-fg-primary">{item.name}</p>
                <Select
                  label="Reason"
                  options={RETURN_REASONS.map((r) => ({ value: r.value, label: r.label }))}
                  placeholder="Select a reason"
                  value={reasons[itemId] || ''}
                  onChange={(e) => setReasons({ ...reasons, [itemId]: e.target.value })}
                />
                {reasons[itemId] === 'other' && (
                  <Input
                    label="Please describe"
                    value={comments[itemId] || ''}
                    onChange={(e) => setComments({ ...comments, [itemId]: e.target.value })}
                    placeholder="Tell us more..."
                  />
                )}
              </div>
            )
          })}
          <Button onClick={() => setStep(2)} disabled={!canProceedStep1} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Return method */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">How would you like to return the item(s)?</p>
          <div className="space-y-2">
            {[
              { value: 'dropoff' as const, label: 'Drop off at a pickup point', desc: 'Free — drop off at your nearest PostNord or GLS point' },
              { value: 'pickup' as const, label: 'Home pickup', desc: 'Free — we will schedule a pickup at your address' },
              { value: 'store' as const, label: 'Return in store', desc: 'Bring it to any Kasasagi partner store' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                  method === opt.value ? 'border-accent bg-blue-50/30' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="returnMethod"
                  value={opt.value}
                  checked={method === opt.value}
                  onChange={() => setMethod(opt.value)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <div>
                  <p className="text-sm font-medium text-fg-primary">{opt.label}</p>
                  <p className="text-xs text-fg-muted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="pt-2">
            <p className="text-sm text-fg-secondary mb-2">Would you like a refund or exchange?</p>
            <div className="flex gap-2">
              <Button
                variant={preferRefund ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPreferRefund(true)}
              >
                Refund
              </Button>
              <Button
                variant={!preferRefund ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPreferRefund(false)}
              >
                Exchange
              </Button>
            </div>
          </div>
          <Button onClick={() => setStep(3)} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Review
          </Button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Please review your return request.</p>
          <div className="rounded-md border border-border p-4 space-y-3">
            <h3 className="text-sm font-medium text-fg-primary">Items to return</h3>
            {Array.from(selectedItems).map((itemId) => {
              const item = order.items.find((i) => i.id === itemId)
              return item ? (
                <div key={itemId} className="flex justify-between text-sm">
                  <span className="text-fg-secondary">{item.name}</span>
                  <span className="text-fg-muted capitalize">{reasons[itemId]?.replace('_', ' ')}</span>
                </div>
              ) : null
            })}
            <div className="pt-2 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-fg-secondary">Method</span>
                <span className="text-fg-primary capitalize">{method}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-fg-secondary">Resolution</span>
                <span className="text-fg-primary">{preferRefund ? 'Refund' : 'Exchange'}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Confirm return
          </Button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && result && (
        <div className="text-center space-y-4 py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="font-display text-xl text-fg-primary">Return created</h2>
            <p className="text-sm text-fg-secondary mt-1">
              Your return number is{' '}
              <span className="font-mono font-medium">{result.returnNumber}</span>
            </p>
          </div>
          <div className="rounded-md border border-border bg-bg-surface p-4 text-left">
            <h3 className="text-sm font-medium text-fg-primary mb-2">Next steps</h3>
            <ol className="space-y-2">
              {result.instructions.map((instruction, i) => (
                <li key={i} className="flex gap-2 text-sm text-fg-secondary">
                  <span className="shrink-0 text-fg-muted">{i + 1}.</span>
                  {instruction}
                </li>
              ))}
            </ol>
            <p className="text-xs text-fg-muted mt-3">
              Estimated processing time: {result.estimatedProcessingDays} business days after we receive your return.
            </p>
          </div>
          {result.labelUrl && (
            <a href={result.labelUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" icon={<Download className="h-4 w-4" />} className="w-full">
                Download return label
              </Button>
            </a>
          )}
          <Button variant="ghost" onClick={() => router.push(`/order/${params.orderId as string}`)} className="w-full">
            Back to order
          </Button>
        </div>
      )}
    </FlowStepWrapper>
  )
}
