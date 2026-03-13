'use client'

import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

const CancelFlow = dynamic(
  () => import('@/components/flows/CancelFlow').then((m) => ({ default: m.CancelFlow })),
  { loading: () => <SkeletonLoader lines={5} /> }
)

export default function CancelPage() {
  return <CancelFlow />
}
