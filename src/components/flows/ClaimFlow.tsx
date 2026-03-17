'use client'

import { useState } from 'react'
import { useOrderStore } from '@/stores/order-store'
import { useUIStore } from '@/stores/ui-store'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FlowStepWrapper } from './FlowStepWrapper'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { FileUpload } from '@/components/ui/FileUpload'
import { CLAIM_TYPES } from '@/lib/constants'
import type { ClaimResponse } from '@/types/flow'
import { CheckCircle, ArrowRight, Clock } from 'lucide-react'

const STEPS = ['Select item', 'Issue type', 'Evidence', 'Description', 'Resolution', 'Confirmation']

export function ClaimFlow() {
  const params = useParams()
  const router = useRouter()
  const order = useOrderStore((s) => s.currentOrder)
  const addToast = useUIStore((s) => s.addToast)

  const [step, setStep] = useState(0)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [claimType, setClaimType] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [resolution, setResolution] = useState<'replacement' | 'repair' | 'refund'>('replacement')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClaimResponse | null>(null)

  if (!order) return null

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const imageUrls: string[] = []
      for (const file of files) {
        const url = await api.uploadFile(file)
        imageUrls.push(url)
      }

      const res = await api.submitClaim(order.id, {
        orderId: order.id,
        itemId: selectedItemId,
        type: claimType as 'defective' | 'damaged' | 'wrong_item' | 'missing_parts' | 'warranty',
        description,
        imageUrls,
        preferredResolution: resolution,
      })
      setResult(res)
      setStep(5)
      addToast({ type: 'success', message: 'Your claim has been submitted.' })
    } catch {
      addToast({ type: 'error', message: 'Your claim couldn\u2019t be submitted. Please try again — your photos and description are still saved.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowStepWrapper
      title="Report an Issue"
      steps={STEPS}
      currentStep={step}
      onBack={step > 0 && step < 5 ? () => setStep(step - 1) : undefined}
    >
      {/* Step 0: Select item */}
      {step === 0 && (() => {
        // Items are claimable if the order is shipped/delivered, OR if the individual item is in_stock
        // (meaning it was part of a partial delivery). Delayed/backordered items are not yet received.
        const isReceivedStatus = order.status === 'delivered' || order.status === 'shipped'
        const isItemClaimable = (item: typeof order.items[number]) => {
          if (isReceivedStatus) return true
          // For orders still being processed, only in-stock items from a partial delivery could have been received
          // But if the order hasn't shipped at all, nothing is claimable
          if (order.delayInfo?.partialDeliveryAvailable && order.delayInfo.availableItemIds?.includes(item.id)) {
            return false // partial delivery option exists but hasn't been acted on yet — not shipped
          }
          return false
        }
        const claimableItems = order.items.filter(isItemClaimable)
        const nonClaimableItems = order.items.filter((item) => !isItemClaimable(item))

        return (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Which item has an issue?</p>
          {claimableItems.length === 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50/40 p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-fg-primary">No items eligible for a claim yet</p>
                <p className="text-xs text-fg-secondary mt-1">
                  You can only report an issue with items that have been shipped or delivered. Your order is still being processed.
                </p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {claimableItems.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                  selectedItemId === item.id ? 'border-accent bg-blue-50/30' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="claimItem"
                  value={item.id}
                  checked={selectedItemId === item.id}
                  onChange={() => setSelectedItemId(item.id)}
                  className="accent-[var(--color-accent)]"
                />
                <div className="h-10 w-10 shrink-0 rounded border border-border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm text-fg-primary">{item.name}</span>
              </label>
            ))}
            {nonClaimableItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border border-border p-3 opacity-50"
              >
                <input type="radio" disabled className="accent-[var(--color-accent)]" />
                <div className="h-10 w-10 shrink-0 rounded border border-border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="text-sm text-fg-primary">{item.name}</span>
                  <p className="text-xs text-fg-muted">Not yet shipped — cannot claim</p>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setStep(1)} disabled={!selectedItemId} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
        )
      })()}

      {/* Step 1: Issue type */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">What type of issue are you experiencing?</p>
          <Select
            label="Issue type"
            options={CLAIM_TYPES.map((c) => ({ value: c.value, label: c.label }))}
            placeholder="Select issue type"
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
          />
          <Button onClick={() => setStep(2)} disabled={!claimType} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Evidence (photos) */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">
            Please upload photos of the issue. This helps us process your claim faster.
          </p>
          <FileUpload onFilesChange={setFiles} />
          <Button onClick={() => setStep(3)} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            {files.length > 0 ? 'Continue' : 'Skip photos'}
          </Button>
        </div>
      )}

      {/* Step 3: Description */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">Please describe the issue in detail.</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened, when you noticed the issue, etc. (minimum 20 characters)"
            rows={5}
            className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 resize-none"
          />
          <p className="text-xs text-fg-muted">{description.length}/20 minimum characters</p>
          <Button onClick={() => setStep(4)} disabled={description.length < 20} icon={<ArrowRight className="h-4 w-4" />} className="w-full">
            Continue
          </Button>
        </div>
      )}

      {/* Step 4: Resolution */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">How would you like this resolved?</p>
          <div className="space-y-2">
            {[
              { value: 'replacement' as const, label: 'Send me a replacement', desc: 'We will ship a new item to you' },
              { value: 'refund' as const, label: 'Refund me', desc: 'Refund to your original payment method' },
              { value: 'repair' as const, label: 'Repair the item', desc: 'We will arrange repair if possible' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors ${
                  resolution === opt.value ? 'border-accent bg-blue-50/30' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  value={opt.value}
                  checked={resolution === opt.value}
                  onChange={() => setResolution(opt.value)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <div>
                  <p className="text-sm font-medium text-fg-primary">{opt.label}</p>
                  <p className="text-xs text-fg-muted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Submit claim
          </Button>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === 5 && result && (
        <div className="text-center space-y-4 py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="font-display text-xl text-fg-primary">Claim submitted</h2>
            <p className="text-sm text-fg-secondary mt-1">
              Your case number is{' '}
              <span className="font-mono font-medium">{result.caseNumber}</span>
            </p>
          </div>
          <div className="rounded-md border border-border bg-bg-surface p-4 text-left">
            <p className="text-sm text-fg-secondary">
              Your claim is being processed automatically. You will receive an email
              confirmation with the outcome within{' '}
              <strong>{result.estimatedResponseDays} business days</strong>.
              You can track the status of your claim from your order page.
            </p>
          </div>
          <Button variant="ghost" onClick={() => router.push(`/order/${params.orderId as string}`)} className="w-full">
            Back to order
          </Button>
        </div>
      )}
    </FlowStepWrapper>
  )
}
