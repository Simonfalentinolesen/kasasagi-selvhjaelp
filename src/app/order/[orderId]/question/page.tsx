'use client'

import dynamic from 'next/dynamic'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

const QuestionFlow = dynamic(
  () => import('@/components/flows/QuestionFlow').then((m) => ({ default: m.QuestionFlow })),
  { loading: () => <SkeletonLoader lines={5} /> }
)

export default function QuestionPage() {
  return <QuestionFlow />
}
