'use client'

import { useRef, useState } from 'react'
import { useFAQSearch } from '@/hooks/useFAQ'
import { Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { query, search, results, loading } = useFAQSearch()
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const showDropdown = focused && query.length >= 2

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search for help..."
          className={cn(
            'w-full h-12 rounded-lg border bg-bg-surface pl-11 pr-4',
            'text-fg-primary placeholder:text-fg-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1',
            'border-border hover:border-fg-muted transition-colors'
          )}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="faq-search-results"
          aria-label="Search help articles"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted animate-spin" />
        )}
      </div>

      {showDropdown && (
        <div
          id="faq-search-results"
          className="absolute top-full left-0 right-0 z-20 mt-1 rounded-md border border-border bg-bg-surface shadow-md overflow-hidden"
          role="listbox"
        >
          {results.length > 0 ? (
            results.slice(0, 6).map((result) => (
              <Link
                key={result.article.slug}
                href={`/faq/${result.article.categorySlug}/${result.article.slug}`}
                className="flex flex-col gap-0.5 px-4 py-3 hover:bg-bg-surface-2 transition-colors border-b border-border last:border-0"
                role="option"
              >
                <span className="text-sm font-medium text-fg-primary">{result.article.title}</span>
                <span className="text-xs text-fg-muted line-clamp-1">{result.highlight}</span>
              </Link>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-fg-secondary">
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-fg-muted mt-1">
                Try different keywords, or <a href="/faq" className="text-accent hover:underline">browse all topics</a>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
