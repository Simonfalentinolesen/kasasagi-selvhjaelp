'use client'

import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

const ReturnFlow = dynamic(
  () => import('@/components/flows/ReturnFlow').then((m) => ({ default: m.ReturnFlow })),
  { loading: () => <SkeletonLoader lines={5} /> }
)

export default function ReturnPage() {
  return <ReturnFlow />
}
