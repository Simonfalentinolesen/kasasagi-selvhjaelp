'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { Package, MapPin, RotateCcw, MessageCircle } from 'lucide-react'

interface BottomNavProps {
  orderId: string
  className?: string
}

export function BottomNav({ orderId, className }: BottomNavProps) {
  const pathname = usePathname()
  const base = `/order/${orderId}`

  const links = [
    { href: base, label: 'Order', icon: Package },
    { href: `${base}/tracking`, label: 'Tracking', icon: MapPin },
    { href: `${base}/return`, label: 'Return', icon: RotateCcw },
    { href: `${base}/question`, label: 'Help', icon: MessageCircle },
  ]

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 border-t border-border bg-bg-surface z-40 md:hidden',
        className
      )}
      aria-label="Order navigation"
    >
      <div className="flex items-center justify-around h-14">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors min-w-[44px] min-h-[44px] justify-center',
                isActive ? 'text-accent' : 'text-fg-muted'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
