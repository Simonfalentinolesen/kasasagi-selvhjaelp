'use client'

import { useFAQCategories } from '@/hooks/useFAQ'
import { SearchBar } from '@/components/faq/SearchBar'
import { CategoryGrid } from '@/components/faq/CategoryGrid'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'

export default function FAQPage() {
  const { categories, loading, error, refetch } = useFAQCategories()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl text-fg-primary">Help Center</h1>
        <p className="text-fg-muted">Find answers to common questions</p>
      </div>

      <SearchBar />

      {loading ? (
        <SkeletonLoader lines={6} />
      ) : error ? (
        <ErrorState title="Couldn&apos;t load help topics" message="We&apos;re having trouble loading the help center. Please try refreshing." onRetry={refetch} />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  )
}
