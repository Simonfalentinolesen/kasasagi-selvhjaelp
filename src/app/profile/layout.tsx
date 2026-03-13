'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ProfileSideNav, ProfileTabNav } from '@/components/profile/ProfileSideNav'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="space-y-4">
      <ProfileTabNav />
      <div className="flex gap-6">
        <ProfileSideNav className="hidden md:flex w-48 shrink-0" />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
