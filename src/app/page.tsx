import { OrderLookup } from '@/components/auth/OrderLookup'
import Link from 'next/link'
import {
  HelpCircle, LogIn, RotateCcw, AlertTriangle, Truck, BookOpen, ShieldCheck, Wrench,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center pt-8 sm:pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-fg-primary mb-3">
            Self-Service Center
          </h1>
          <p className="text-fg-secondary">
            Track orders, manage returns, find care guides, and resolve issues — all in one place.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-bg-surface p-6 shadow-sm">
          <OrderLookup />
        </div>

        <div className="mt-4 rounded-md border border-border bg-bg-surface/50 p-3 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors font-medium"
          >
            <LogIn className="h-4 w-4" strokeWidth={1.5} />
            Have an account? Log in for faster access
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-fg-muted mb-3">
            Can&apos;t find your order number? Check your confirmation email.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
          >
            <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
            Browse our Help Center
          </Link>
        </div>

        {/* Quick links to common self-service tasks */}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-fg-secondary text-center mb-4">
            Everything you need, right here
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { href: '/faq/delivery', icon: Truck, label: 'Delivery' },
              { href: '/faq/returns', icon: RotateCcw, label: 'Returns' },
              { href: '/faq/materials', icon: BookOpen, label: 'Care guides' },
              { href: '/faq/furniture', icon: Wrench, label: 'Assembly' },
              { href: '/faq/warranty', icon: ShieldCheck, label: 'Warranty' },
              { href: '/faq/other', icon: AlertTriangle, label: 'Report issue' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-md border border-border p-3 text-fg-muted hover:text-accent hover:border-accent/30 transition-colors"
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-fg-muted">
          Kasasagi is a fully self-service experience. All support is handled through this portal.
        </p>
      </div>
    </div>
  )
}
