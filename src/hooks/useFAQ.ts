'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { FAQCategory, FAQArticle, FAQSearchResult } from '@/types/faq'

export function useFAQCategories() {
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .getFAQCategories()
      .then(setCategories)
      .catch(() => setError('Help topics couldn\u2019t be loaded right now. Please try refreshing.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { categories, loading, error, refetch: fetch }
}

export function useFAQArticles(categorySlug: string) {
  const [articles, setArticles] = useState<FAQArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .getFAQArticlesByCategory(categorySlug)
      .then(setArticles)
      .catch(() => setError('These articles couldn\u2019t be loaded. Please try refreshing the page.'))
      .finally(() => setLoading(false))
  }, [categorySlug])

  useEffect(() => { fetch() }, [fetch])

  return { articles, loading, error, refetch: fetch }
}

export function useFAQArticle(articleSlug: string) {
  const [article, setArticle] = useState<FAQArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)
    api
      .getFAQArticle(articleSlug)
      .then(setArticle)
      .catch(() => setError('We couldn\u2019t find this article. It may have been moved or removed.'))
      .finally(() => setLoading(false))
  }, [articleSlug])

  useEffect(() => { fetch() }, [fetch])

  return { article, loading, error, refetch: fetch }
}

export function useFAQSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FAQSearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback((q: string) => {
    setQuery(q)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timeout = setTimeout(() => {
      api.searchFAQ(query).then(setResults).finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { query, search, results, loading }
}
