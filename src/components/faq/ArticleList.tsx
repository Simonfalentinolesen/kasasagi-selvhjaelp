'use client'

import Link from 'next/link'
import type { FAQArticle } from '@/types/faq'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ArticleListProps {
  articles: FAQArticle[]
  className?: string
}

export function ArticleList({ articles, className }: ArticleListProps) {
  return (
    <div className={cn('divide-y divide-border rounded-md border border-border bg-bg-surface', className)}>
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/faq/${article.categorySlug}/${article.slug}`}
          className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-bg-surface-2 transition-colors"
        >
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-fg-primary">{article.title}</h3>
            <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">{article.excerpt}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-fg-muted" />
        </Link>
      ))}
    </div>
  )
}
