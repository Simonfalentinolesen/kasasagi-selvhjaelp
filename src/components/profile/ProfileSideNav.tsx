'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  LayoutDashboard, ShoppingBag, Settings, MapPin, Bell,
} from 'lucide-react'

interface ProfileSideNavProps {
  className?: string
}

const links = [
  { href: '/profile', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/profile/settings', label: 'Personal Info', icon: Settings },
  { href: '/profile/addresses', label: 'Addresses', icon: MapPin },
  { href: '/profile/preferences', label: 'Notifications', icon: Bell },
]

export function ProfileSideNav({ className }: ProfileSideNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col gap-1', className)} aria-label="Profile navigation">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-bg-surface-2 text-fg-primary font-medium'
                : 'text-fg-secondary hover:bg-bg-surface-2 hover:text-fg-primary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Horizontal tab version for mobile */
export function ProfileTabNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex gap-1 overflow-x-auto pb-2 scrollbar-none md:hidden"
      aria-label="Profile navigation"
    >
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors shrink-0',
              isActive
                ? 'bg-accent text-white font-medium'
                : 'bg-bg-surface-2 text-fg-secondary hover:text-fg-primary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
