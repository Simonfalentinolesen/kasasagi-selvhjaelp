'use client'

import type { User } from '@/types/user'
import { Badge } from '@/components/ui/Badge'
import { CalendarDays } from 'lucide-react'

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white text-lg font-medium shrink-0">
        {initials}
      </div>
      <div>
        <h1 className="font-display text-2xl text-fg-primary">
          {user.firstName} {user.lastName}
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-fg-secondary">{user.email}</p>
          <Badge variant="neutral" className="text-[10px]">
            <CalendarDays className="h-3 w-3 mr-1" strokeWidth={1.5} />
            Member since {memberSince}
          </Badge>
        </div>
      </div>
    </div>
  )
}
