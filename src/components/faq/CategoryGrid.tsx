'use client'

import Link from 'next/link'
import type { FAQCategory } from '@/types/faq'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/cn'

interface CategoryGridProps {
  categories: FAQCategory[]
  className?: string
}

function getIcon(iconName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any
  return (icons[iconName] || LucideIcons.HelpCircle) as React.ComponentType<{ className?: string; strokeWidth?: number }>
}

export function CategoryGrid({ categories, className }: CategoryGridProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-3', className)}>
      {categories.map((cat) => {
        const Icon = getIcon(cat.icon)
        return (
          <Link
            key={cat.slug}
            href={`/faq/${cat.slug}`}
            className="group rounded-md border border-border bg-bg-surface p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <Icon className="h-6 w-6 text-accent mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-medium text-fg-primary group-hover:text-accent transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-fg-muted mt-1 line-clamp-2">{cat.description}</p>
            <p className="text-xs text-fg-muted mt-2">{cat.articleCount} articles</p>
          </Link>
        )
      })}
    </div>
  )
}
