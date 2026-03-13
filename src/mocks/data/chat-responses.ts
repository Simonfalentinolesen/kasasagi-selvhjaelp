interface ChatPattern {
  keywords: string[]
  response: string
  actions?: { label: string; type: 'link' | 'flow'; target: string }[]
}

export const chatPatterns: ChatPattern[] = [
  // ── Order & Delivery ──────────────────────────────────────
  {
    keywords: ['where', 'tracking', 'track', 'status', 'when', 'arrive', 'delivery'],
    response: 'I can see your order is currently {status}. {trackingInfo} Is there anything else I can help with?',
    actions: [
      { label: 'View tracking details', type: 'link', target: '/tracking' },
    ],
  },
  {
    keywords: ['return', 'send back', 'refund', 'exchange'],
    response: 'You can initiate a return directly from your order page. Returns are accepted within 14 days of delivery.',
    actions: [
      { label: 'Start a return', type: 'flow', target: '/return' },
      { label: 'Return policy', type: 'link', target: '/faq/returns' },
    ],
  },
  {
    keywords: ['cancel', 'stop', 'undo order'],
    response: 'Cancellation is only possible if the order has not been shipped yet. Let me take you to the cancellation flow.',
    actions: [
      { label: 'Cancel order', type: 'flow', target: '/cancel' },
    ],
  },
  {
    keywords: ['damaged', 'broken', 'defective', 'wrong', 'complaint', 'claim', 'scratch', 'crack', 'dent'],
    response: 'I\'m sorry to hear about that. You can file a claim directly through your order page with photos of the issue.',
    actions: [
      { label: 'File a claim', type: 'flow', target: '/claim' },
    ],
  },
  {
    keywords: ['change', 'modify'],
    response: 'You can request changes to your order before it ships — including address, size, or color.',
    actions: [
      { label: 'Change order', type: 'flow', target: '/change' },
    ],
  },
  {
    keywords: ['payment', 'pay', 'invoice', 'charge', 'bill', 'klarna'],
    response: 'For payment-related questions, check our payment FAQ. You can also view payment details on your order page.',
    actions: [
      { label: 'Payment FAQ', type: 'link', target: '/faq/payment' },
    ],
  },

  // ── Furniture-specific ────────────────────────────────────
  {
    keywords: ['assembly', 'assemble', 'put together', 'build', 'instructions', 'manual'],
    response: 'Assembly instructions are included with your furniture and also available digitally from your order page. Check our FAQ for detailed guides.',
    actions: [
      { label: 'Assembly guide', type: 'link', target: '/faq/furniture' },
      { label: 'Submit a question', type: 'flow', target: '/question' },
    ],
  },
  {
    keywords: ['warranty', 'guarantee', 'covered', 'warranty claim'],
    response: 'All products come with a 2-year warranty. Furniture frames have a 5-year structural warranty. You can file a warranty claim from your order page.',
    actions: [
      { label: 'Warranty info', type: 'link', target: '/faq/warranty' },
      { label: 'File a claim', type: 'flow', target: '/claim' },
    ],
  },
  {
    keywords: ['care', 'clean', 'wash', 'stain', 'maintain', 'oil', 'polish'],
    response: 'We have detailed care guides for every material we use — wood, upholstery, silk, linen, ceramics, and more.',
    actions: [
      { label: 'Material care guides', type: 'link', target: '/faq/materials' },
    ],
  },
  {
    keywords: ['wobble', 'wobbling', 'unstable', 'creak', 'creaking', 'loose'],
    response: 'Wobbling or creaking is often fixed by tightening bolts and joints. Check our troubleshooting guide, or file a claim if the issue persists.',
    actions: [
      { label: 'Troubleshooting guide', type: 'link', target: '/faq/furniture' },
      { label: 'File a claim', type: 'flow', target: '/claim' },
    ],
  },
  {
    keywords: ['measure', 'dimension', 'fit', 'space', 'door', 'doorway', 'stair'],
    response: 'All product dimensions are listed on the product page. For furniture, check our measuring guide to ensure it fits through doorways and into your space.',
    actions: [
      { label: 'Measuring guide', type: 'link', target: '/faq/furniture' },
    ],
  },
  {
    keywords: ['fabric', 'upholster', 'sofa', 'couch', 'cushion', 'leather'],
    response: 'We have specific care guides for fabric and leather upholstery. Check our materials section for cleaning and maintenance tips.',
    actions: [
      { label: 'Upholstery care', type: 'link', target: '/faq/materials' },
    ],
  },
  {
    keywords: ['wood', 'oak', 'walnut', 'teak', 'oil', 'wax', 'lacquer'],
    response: 'Different wood finishes require different care. Check our wood care guide for oiling, cleaning, and maintenance instructions.',
    actions: [
      { label: 'Wood care guide', type: 'link', target: '/faq/materials' },
    ],
  },
  {
    keywords: ['marble', 'stone', 'ceramic', 'stoneware', 'porcelain'],
    response: 'Natural stone and ceramics need gentle care. Our guide covers sealing, cleaning, and stain prevention.',
    actions: [
      { label: 'Stone & ceramic care', type: 'link', target: '/faq/materials' },
    ],
  },
  {
    keywords: ['silk', 'linen', 'wool', 'cotton', 'textile', 'cashmere'],
    response: 'Each textile has specific care requirements. Check our textile care guides for washing, drying, and storage tips.',
    actions: [
      { label: 'Textile care guides', type: 'link', target: '/faq/materials' },
    ],
  },
  {
    keywords: ['large item', 'freight', 'white glove', 'furniture delivery', 'heavy'],
    response: 'Large items and furniture are delivered by specialist freight carriers. You can choose standard or white-glove delivery (with in-room placement).',
    actions: [
      { label: 'Furniture delivery info', type: 'link', target: '/faq/delivery' },
    ],
  },
  {
    keywords: ['missing', 'incomplete', 'partial', 'not all'],
    response: 'Your order may arrive in multiple deliveries if items ship from different locations. Check your order page to see the status of each item.',
    actions: [
      { label: 'Check order status', type: 'link', target: '/tracking' },
      { label: 'File a claim', type: 'flow', target: '/claim' },
    ],
  },
  {
    keywords: ['sustainable', 'eco', 'environment', 'material', 'organic', 'fsc'],
    response: 'We are committed to sustainability — FSC-certified wood, OEKO-TEX textiles, and 100% recyclable packaging. Learn more in our FAQ.',
    actions: [
      { label: 'Sustainability', type: 'link', target: '/faq/other' },
    ],
  },
  {
    keywords: ['gift', 'wrap', 'present', 'gift card'],
    response: 'Gift wrapping is available for smaller items at checkout (39 DKK). Gift receipts can be added to any order.',
    actions: [
      { label: 'Gift wrapping info', type: 'link', target: '/faq/other' },
    ],
  },
  {
    keywords: ['sample', 'swatch', 'fabric sample'],
    response: 'Fabric samples are available for our upholstered furniture — order them free on the product page. They usually arrive within 2-3 days.',
    actions: [
      { label: 'Product info', type: 'link', target: '/faq/products' },
    ],
  },
  {
    keywords: ['address', 'move', 'new address'],
    response: 'You can change your delivery address before the order ships. Use the "Change Order" feature on your order page.',
    actions: [
      { label: 'Change order', type: 'flow', target: '/change' },
    ],
  },

  // ── General ───────────────────────────────────────────────
  {
    keywords: ['hello', 'hi', 'hey', 'help'],
    response: 'Hello! Welcome to the Kasasagi self-service portal. I can help you with orders, returns, product care, assembly, and more. What do you need?',
  },
  {
    keywords: ['talk', 'human', 'agent', 'person', 'real', 'support', 'call', 'phone', 'email'],
    response: 'All support at Kasasagi is handled through this self-service portal. You can submit a detailed question, file a claim, or browse our help articles for immediate answers.',
    actions: [
      { label: 'Submit a question', type: 'flow', target: '/question' },
      { label: 'Browse help articles', type: 'link', target: '/faq' },
    ],
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    response: 'You\'re welcome! If you need anything else, the self-service portal is always available. Take care!',
  },
]

export function findBestResponse(message: string): ChatPattern {
  const lower = message.toLowerCase()
  const matched = chatPatterns.find((pattern) =>
    pattern.keywords.some((keyword) => lower.includes(keyword))
  )
  return matched || {
    keywords: [],
    response: 'I\'m not sure I understand. You can browse our help articles for detailed guides, or submit a question through your order page.',
    actions: [
      { label: 'Browse help articles', type: 'link', target: '/faq' },
      { label: 'Submit a question', type: 'flow', target: '/question' },
    ],
  }
}
