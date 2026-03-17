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

        {/* Demo/test info — remove before production */}
        {process.env.NEXT_PUBLIC_MOCK_API === 'true' && (
          <div className="mt-6 rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-4 text-left">
            <p className="text-xs font-medium text-amber-800 mb-2">🧪 Test mode — demo data</p>
            <div className="space-y-2 text-xs text-amber-700">
              <div>
                <p className="font-medium">Order lookup:</p>
                <p className="font-mono text-[11px] mt-0.5">Email: anna@example.com</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 font-mono text-[11px]">
                  <span>KAS-20401 <span className="text-amber-500">(pending)</span></span>
                  <span>KAS-20387 <span className="text-amber-500">(confirmed)</span></span>
                  <span>KAS-20295 <span className="text-amber-500">(delayed + split delivery)</span></span>
                  <span>KAS-20350 <span className="text-amber-500">(packed)</span></span>
                  <span>KAS-20312 <span className="text-amber-500">(shipped)</span></span>
                  <span>KAS-20180 <span className="text-amber-500">(delivered)</span></span>
                </div>
              </div>
              <div className="border-t border-amber-200 pt-2">
                <p className="font-medium">Profile login:</p>
                <p className="font-mono text-[11px] mt-0.5">anna@example.com / password123</p>
                <p className="font-mono text-[11px]">mikkel@example.com / password123 <span className="text-amber-500">(empty profile)</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
