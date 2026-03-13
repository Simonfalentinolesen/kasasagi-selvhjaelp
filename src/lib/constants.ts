import type { OrderStatus } from '@/types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order received',
  confirmed: 'Order confirmed',
  packed: 'Being packed',
  shipped: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
]

export const RETURN_REASONS = [
  { value: 'wrong_size', label: 'Wrong size / does not fit' },
  { value: 'not_as_expected', label: 'Different than expected' },
  { value: 'color_mismatch', label: 'Color does not match photos' },
  { value: 'too_large_for_space', label: 'Too large for the intended space' },
  { value: 'quality_not_expected', label: 'Quality not as expected' },
  { value: 'defective', label: 'Defective / damaged item' },
  { value: 'duplicate', label: 'Received two of the same' },
  { value: 'wrong_material', label: 'Wrong material or finish' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'found_alternative', label: 'Found a better alternative' },
  { value: 'other', label: 'Other reason' },
] as const

export const CLAIM_TYPES = [
  { value: 'defective', label: 'Defective product' },
  { value: 'damaged', label: 'Damaged during shipping' },
  { value: 'wrong_item', label: 'Wrong item received' },
  { value: 'missing_parts', label: 'Missing parts or hardware' },
  { value: 'material_issue', label: 'Material defect (fabric, wood, finish)' },
  { value: 'quality_concern', label: 'Quality does not match description' },
  { value: 'color_fading', label: 'Color fading or discoloration' },
  { value: 'structural_damage', label: 'Structural issue (wobbling, instability)' },
  { value: 'assembly_issue', label: 'Assembly instructions missing or incorrect' },
  { value: 'warranty', label: 'Warranty claim' },
] as const

export const QUESTION_CATEGORIES = [
  { value: 'order_status', label: 'Order status' },
  { value: 'product', label: 'Product information' },
  { value: 'shipping', label: 'Shipping & delivery' },
  { value: 'payment', label: 'Payment & billing' },
  { value: 'assembly', label: 'Assembly & installation' },
  { value: 'warranty', label: 'Warranty & guarantees' },
  { value: 'care_instructions', label: 'Product care & maintenance' },
  { value: 'measurements', label: 'Measurements & sizing' },
  { value: 'materials', label: 'Materials & sustainability' },
  { value: 'delivery_scheduling', label: 'Delivery scheduling (large items)' },
  { value: 'other', label: 'Other' },
] as const

export const FAQ_CATEGORIES_ICONS: Record<string, string> = {
  delivery: 'Truck',
  returns: 'RotateCcw',
  payment: 'CreditCard',
  products: 'Package',
  furniture: 'Armchair',
  materials: 'Sparkles',
  warranty: 'ShieldCheck',
  account: 'User',
  other: 'HelpCircle',
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_FILES = 5
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/heic']
