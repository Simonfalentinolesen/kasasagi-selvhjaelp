'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/profile')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  return (
    <div className="flex flex-col items-center pt-8 sm:pt-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-fg-primary mb-2">
            Welcome back
          </h1>
          <p className="text-fg-secondary text-sm">
            Log in to manage your orders, addresses, and preferences.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-bg-surface p-6 shadow-sm">
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Look up order as guest
          </Link>
        </div>

        <div className="mt-8 rounded-md border border-border bg-bg-surface/50 p-4">
          <p className="text-xs text-fg-muted text-center">
            <span className="font-medium text-fg-secondary">Test accounts:</span><br />
            anna@example.com / password123<br />
            mikkel@example.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}
