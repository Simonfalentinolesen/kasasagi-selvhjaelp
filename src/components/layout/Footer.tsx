import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-fg-muted">
            &copy; {new Date().getFullYear()} Kasasagi ApS
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/faq" className="text-xs text-fg-muted hover:text-fg-secondary transition-colors">
              Help Center
            </Link>
            <Link href="/faq/warranty" className="text-xs text-fg-muted hover:text-fg-secondary transition-colors">
              Warranty
            </Link>
            <Link href="/faq/materials" className="text-xs text-fg-muted hover:text-fg-secondary transition-colors">
              Care Guides
            </Link>
          </nav>
        </div>
        <p className="text-[11px] text-fg-muted/60 text-center mt-3">
          All support is handled through the self-service portal. No phone or email support available.
        </p>
      </div>
    </footer>
  )
}
