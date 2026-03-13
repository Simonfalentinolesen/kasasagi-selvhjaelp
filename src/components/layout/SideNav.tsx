'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import {
  Package, MapPin, RotateCcw, XCircle, AlertTriangle, PenLine, MessageCircle,
} from 'lucide-react'

interface SideNavProps {
  orderId: string
  cancelEligible?: boolean
  changeEligible?: boolean
  className?: string
}

export function SideNav({ orderId, cancelEligible, changeEligible, className }: SideNavProps) {
  const pathname = usePathname()
  const base = `/order/${orderId}`

  const links = [
    { href: base, label: 'Overview', icon: Package },
    { href: `${base}/tracking`, label: 'Tracking', icon: MapPin },
    { href: `${base}/return`, label: 'Return', icon: RotateCcw },
    { href: `${base}/cancel`, label: 'Cancel', icon: XCircle, hidden: !cancelEligible },
    { href: `${base}/claim`, label: 'Claim', icon: AlertTriangle },
    { href: `${base}/change`, label: 'Change', icon: PenLine, hidden: !changeEligible },
    { href: `${base}/question`, label: 'Ask a question', icon: MessageCircle },
  ]

  return (
    <nav className={cn('flex flex-col gap-1', className)} aria-label="Order navigation">
      {links
        .filter((l) => !l.hidden)
        .map((link) => {
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
