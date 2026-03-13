'use client'

import { useProfile } from '@/hooks/useProfile'
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

export default function ProfileSettingsPage() {
  const { profile, loading, updatePersonalInfo } = useProfile()

  const handleSave = async (data: { firstName: string; lastName: string; phone?: string }) => {
    await updatePersonalInfo(data)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-fg-primary">Personal Information</h1>

      {loading || !profile ? (
        <div className="space-y-4">
          <SkeletonLoader className="h-10 w-full" />
          <SkeletonLoader className="h-10 w-full" />
          <SkeletonLoader className="h-10 w-full" />
        </div>
      ) : (
        <div className="rounded-md border border-border bg-bg-surface p-5">
          <PersonalInfoForm user={profile.user} onSave={handleSave} />
        </div>
      )}
    </div>
  )
}
