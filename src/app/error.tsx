'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
        <AlertCircle className="h-6 w-6 text-error" />
      </div>
      <h2 className="text-lg font-medium text-fg-primary mb-2">We hit a snag</h2>
      <p className="text-sm text-fg-muted mb-6 max-w-sm">
        Something unexpected happened. You can try refreshing, or head to the{' '}
        <a href="/faq" className="text-accent hover:underline">help center</a> to find what you need.
      </p>
      <Button onClick={reset}>Refresh page</Button>
    </div>
  )
}
