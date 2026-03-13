export interface FAQCategory {
  slug: string
  name: string
  description: string
  icon: string
  articleCount: number
}

export interface FAQArticle {
  slug: string
  categorySlug: string
  title: string
  excerpt: string
  content: string
  relatedFlows?: string[]
  updatedAt: string
  helpful?: number
}

export interface FAQSearchResult {
  article: FAQArticle
  highlight: string
}
