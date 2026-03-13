'use client'

import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

const ChangeFlow = dynamic(
  () => import('@/components/flows/ChangeFlow').then((m) => ({ default: m.ChangeFlow })),
  { loading: () => <SkeletonLoader lines={5} /> }
)

export default function ChangePage() {
  return <ChangeFlow />
}
