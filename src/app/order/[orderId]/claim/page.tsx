'use client'

import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

const ClaimFlow = dynamic(
  () => import('@/components/flows/ClaimFlow').then((m) => ({ default: m.ClaimFlow })),
  { loading: () => <SkeletonLoader lines={5} /> }
)

export default function ClaimPage() {
  return <ClaimFlow />
}
