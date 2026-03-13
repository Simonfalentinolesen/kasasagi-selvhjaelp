'use client'

import { useProfile } from '@/hooks/useProfile'
import { PreferencesForm } from '@/components/profile/PreferencesForm'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import type { EmailPreferences } from '@/types/user'

export default function ProfilePreferencesPage() {
  const { profile, loading, updatePreferences } = useProfile()

  const handleSave = async (prefs: EmailPreferences) => {
    await updatePreferences({ emailPreferences: prefs })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-fg-primary">Email Preferences</h1>
        <p className="text-sm text-fg-secondary mt-1">
          Choose which emails you would like to receive from Kasasagi.
        </p>
      </div>

      {loading || !profile ? (
        <div className="space-y-3">
          <SkeletonLoader className="h-16 w-full" />
          <SkeletonLoader className="h-16 w-full" />
          <SkeletonLoader className="h-16 w-full" />
          <SkeletonLoader className="h-16 w-full" />
          <SkeletonLoader className="h-16 w-full" />
        </div>
      ) : (
        <div className="rounded-md border border-border bg-bg-surface p-5">
          <PreferencesForm
            preferences={profile.preferences.emailPreferences}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  )
}
