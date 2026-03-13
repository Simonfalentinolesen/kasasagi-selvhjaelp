'use client'

import { ArrowLeft, Clock, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import type { FAQArticle } from '@/types/faq'
import { FeedbackWidget } from './FeedbackWidget'
import { cn } from '@/lib/cn'

interface ArticleViewProps {
  article: FAQArticle
  className?: string
}

export function ArticleView({ article, className }: ArticleViewProps) {
  return (
    <article className={cn('space-y-6', className)}>
      <div className="space-y-3">
        <Link
          href={`/faq/${article.categorySlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to category
        </Link>

        <h1 className="font-heading text-2xl text-fg-primary">{article.title}</h1>

        <div className="flex items-center gap-4 text-xs text-fg-muted">
          {article.updatedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Updated {new Date(article.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
          {article.helpful !== undefined && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {article.helpful}% found helpful
            </span>
          )}
        </div>
      </div>

      <div
        className="prose prose-sm max-w-none text-fg-secondary
          prose-headings:font-heading prose-headings:text-fg-primary
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-strong:text-fg-primary
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:marker:text-fg-muted"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <hr className="border-border" />

      <FeedbackWidget articleSlug={article.slug} />
    </article>
  )
}
