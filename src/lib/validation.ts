import { z } from 'zod'

export const orderLookupSchema = z.object({
  orderNumber: z
    .string()
    .min(1, 'Please enter your order number')
    .regex(/^[A-Za-z0-9#-]+$/, 'Invalid order number format'),
  email: z
    .string()
    .min(1, 'Please enter your email')
    .email('Please enter a valid email address'),
})

export type OrderLookupInput = z.infer<typeof orderLookupSchema>

export const returnItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1),
  reason: z.string().min(1, 'Please select a reason'),
  comment: z.string().optional(),
})

export const returnRequestSchema = z.object({
  items: z.array(returnItemSchema).min(1, 'Please select at least one item'),
  method: z.enum(['pickup', 'dropoff', 'store']),
  preferRefund: z.boolean(),
})

export type ReturnRequestInput = z.infer<typeof returnRequestSchema>

export const cancelRequestSchema = z.object({
  reason: z.string().min(1, 'Please select a reason'),
  comment: z.string().optional(),
})

export type CancelRequestInput = z.infer<typeof cancelRequestSchema>

export const claimRequestSchema = z.object({
  itemId: z.string().min(1),
  type: z.enum(['defective', 'damaged', 'wrong_item', 'missing_parts', 'warranty']),
  description: z.string().min(20, 'Please provide at least 20 characters describing the issue'),
  preferredResolution: z.enum(['replacement', 'repair', 'refund']),
})

export type ClaimRequestInput = z.infer<typeof claimRequestSchema>

export const changeRequestSchema = z.object({
  changeType: z.enum(['address', 'variant', 'remove_item', 'other']),
  details: z.record(z.string()),
  comment: z.string().optional(),
})

export type ChangeRequestInput = z.infer<typeof changeRequestSchema>

export const questionRequestSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Please provide at least 10 characters'),
})

export type QuestionRequestInput = z.infer<typeof questionRequestSchema>

export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
})

// ── Profile & Auth schemas ──

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
})

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>

export const savedAddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  isDefault: z.boolean(),
  name: z.string().min(1, 'Name is required'),
  street: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
})

export type SavedAddressInput = z.infer<typeof savedAddressSchema>

export const preferencesSchema = z.object({
  orderUpdates: z.boolean(),
  marketing: z.boolean(),
  newsletters: z.boolean(),
  productReviews: z.boolean(),
  priceAlerts: z.boolean(),
})

export type PreferencesInput = z.infer<typeof preferencesSchema>
