export interface ReturnItem {
  itemId: string
  quantity: number
  reason: string
  comment?: string
}

export interface ReturnRequest {
  orderId: string
  items: ReturnItem[]
  method: 'pickup' | 'dropoff' | 'store'
  preferRefund: boolean
}

export interface ReturnResponse {
  returnId: string
  returnNumber: string
  labelUrl?: string
  instructions: string[]
  estimatedProcessingDays: number
}

export interface CancelRequest {
  orderId: string
  reason: string
  comment?: string
}

export interface CancelResponse {
  success: boolean
  refundAmount: number
  refundMethod: string
  estimatedRefundDays: number
}

export interface ClaimRequest {
  orderId: string
  itemId: string
  type: 'defective' | 'damaged' | 'wrong_item' | 'missing_parts' | 'warranty'
  description: string
  imageUrls: string[]
  preferredResolution: 'replacement' | 'repair' | 'refund'
}

export interface ClaimResponse {
  claimId: string
  caseNumber: string
  status: 'submitted' | 'under_review' | 'approved' | 'denied'
  estimatedResponseDays: number
}

export interface ChangeRequest {
  orderId: string
  changeType: 'address' | 'variant' | 'remove_item' | 'other'
  details: Record<string, string>
  comment?: string
}

export interface ChangeResponse {
  changeId: string
  status: 'submitted' | 'processing' | 'completed' | 'rejected'
  estimatedResponseTime: string
}

export interface QuestionRequest {
  orderId: string
  category: string
  message: string
  attachmentUrls?: string[]
}

export interface QuestionResponse {
  ticketId: string
  referenceNumber: string
  estimatedResponseTime: string
}
