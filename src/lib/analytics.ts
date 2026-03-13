type EventName =
  | 'order_lookup'
  | 'order_lookup_success'
  | 'order_lookup_error'
  | 'tracking_viewed'
  | 'return_started'
  | 'return_completed'
  | 'cancel_started'
  | 'cancel_completed'
  | 'claim_started'
  | 'claim_completed'
  | 'change_started'
  | 'change_completed'
  | 'question_submitted'
  | 'faq_search'
  | 'faq_article_viewed'
  | 'faq_feedback'
  | 'chat_opened'
  | 'chat_message_sent'
  | 'chat_escalated'
  | 'flow_step_completed'
  | 'flow_abandoned'

type EventProperties = Record<string, string | number | boolean | undefined>

function track(event: EventName, properties?: EventProperties) {
  // In production, replace with real analytics provider (Segment, Mixpanel, etc.)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, properties ?? '')
  }

  // Dispatch custom event for potential external listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kasasagi:analytics', {
        detail: { event, properties, timestamp: Date.now() },
      })
    )
  }
}

export const analytics = {
  track,

  orderLookup(orderNumber: string) {
    track('order_lookup', { orderNumber })
  },

  orderLookupSuccess(orderId: string) {
    track('order_lookup_success', { orderId })
  },

  orderLookupError(error: string) {
    track('order_lookup_error', { error })
  },

  trackingViewed(orderId: string, carrier?: string) {
    track('tracking_viewed', { orderId, carrier })
  },

  flowStarted(flow: string, orderId: string) {
    track(`${flow}_started` as EventName, { orderId })
  },

  flowCompleted(flow: string, orderId: string, referenceId?: string) {
    track(`${flow}_completed` as EventName, { orderId, referenceId })
  },

  flowStepCompleted(flow: string, step: number, totalSteps: number) {
    track('flow_step_completed', { flow, step, totalSteps })
  },

  flowAbandoned(flow: string, step: number) {
    track('flow_abandoned', { flow, step })
  },

  faqSearch(query: string, resultCount: number) {
    track('faq_search', { query, resultCount })
  },

  faqArticleViewed(slug: string) {
    track('faq_article_viewed', { slug })
  },

  faqFeedback(slug: string, helpful: boolean) {
    track('faq_feedback', { slug, helpful })
  },

  chatOpened() {
    track('chat_opened')
  },

  chatMessageSent(messageLength: number) {
    track('chat_message_sent', { messageLength })
  },

  chatEscalated() {
    track('chat_escalated')
  },
}
