'use client'

import { useParams } from 'next/navigation'
import { useFAQArticle } from '@/hooks/useFAQ'
import { ArticleView } from '@/components/faq/ArticleView'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'

export default function ArticlePage() {
  const { articleSlug } = useParams<{ articleSlug: string }>()
  const { article, loading, error, refetch } = useFAQArticle(articleSlug)

  if (loading) return <SkeletonLoader lines={8} />
  if (error) return <ErrorState title="Couldn&apos;t load this article" message="Please try refreshing, or go back to browse other help topics." onRetry={refetch} />
  if (!article) return <ErrorState title="Article not found" message="This article may have been moved or removed. Try searching or browse our help center." />

  return <ArticleView article={article} />
}
