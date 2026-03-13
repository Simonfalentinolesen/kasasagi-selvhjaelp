import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-6xl text-fg-primary mb-2">404</h1>
      <h2 className="text-lg font-medium text-fg-primary mb-2">This page doesn&apos;t exist</h2>
      <p className="text-sm text-fg-muted mb-6 max-w-sm">
        The link may be outdated or the page may have moved. Try looking up your order, or browse our help center.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Look up an order
        </Link>
        <Link
          href="/faq"
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-fg-primary hover:bg-bg-surface-2 transition-colors"
        >
          Browse help center
        </Link>
      </div>
    </div>
  )
}
