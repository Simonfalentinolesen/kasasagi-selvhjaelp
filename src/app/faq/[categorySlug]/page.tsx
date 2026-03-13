'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useFAQArticles } from '@/hooks/useFAQ'
import { ArticleList } from '@/components/faq/ArticleList'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { articles, loading, error, refetch } = useFAQArticles(categorySlug)

  const categoryTitle = categorySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>
        <h1 className="font-heading text-2xl text-fg-primary">{categoryTitle}</h1>
      </div>

      {loading ? (
        <SkeletonLoader lines={5} />
      ) : error ? (
        <ErrorState title="Couldn&apos;t load articles" message="We&apos;re having trouble loading these articles. Please try refreshing." onRetry={refetch} />
      ) : articles.length === 0 ? (
        <EmptyState title="No articles yet" description="We&apos;re still building this section. Try searching or browse other categories." />
      ) : (
        <ArticleList articles={articles} />
      )}
    </div>
  )
}
