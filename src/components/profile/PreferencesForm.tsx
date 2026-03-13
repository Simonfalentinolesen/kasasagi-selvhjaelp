'use client'

import type { EmailPreferences } from '@/types/user'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { Check, Mail, Tag, Newspaper, Star, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PreferenceItem {
  key: keyof EmailPreferences
  label: string
  description: string
  icon: LucideIcon
}

const preferenceItems: PreferenceItem[] = [
  {
    key: 'orderUpdates',
    label: 'Order updates',
    description: 'Shipping confirmations, delivery updates, and order status changes',
    icon: Mail,
  },
  {
    key: 'marketing',
    label: 'Promotions & offers',
    description: 'Exclusive deals, seasonal sales, and special promotions',
    icon: Tag,
  },
  {
    key: 'newsletters',
    label: 'Newsletter',
    description: 'Monthly curated content, trends, and product highlights',
    icon: Newspaper,
  },
  {
    key: 'productReviews',
    label: 'Review requests',
    description: 'Invitations to review products you have purchased',
    icon: Star,
  },
  {
    key: 'priceAlerts',
    label: 'Price alerts',
    description: 'Notifications when items in your wishlist drop in price',
    icon: Bell,
  },
]

interface PreferencesFormProps {
  preferences: EmailPreferences
  onSave: (prefs: EmailPreferences) => Promise<void>
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-accent' : 'bg-border'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

export function PreferencesForm({ preferences, onSave }: PreferencesFormProps) {
  const [prefs, setPrefs] = useState<EmailPreferences>({ ...preferences })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(preferences)

  const handleToggle = (key: keyof EmailPreferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(prefs)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-1">
      {preferenceItems.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.key}
            className="flex items-start justify-between gap-4 rounded-md p-3 hover:bg-bg-surface-2 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-fg-muted shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-fg-primary">{item.label}</p>
                <p className="text-xs text-fg-muted mt-0.5">{item.description}</p>
              </div>
            </div>
            <Toggle
              checked={prefs[item.key]}
              onChange={(v) => handleToggle(item.key, v)}
            />
          </div>
        )
      })}

      <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          disabled={!isDirty}
        >
          Save preferences
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  )
}
