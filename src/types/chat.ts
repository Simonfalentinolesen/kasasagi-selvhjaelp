export type ChatRole = 'user' | 'bot' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
  actions?: ChatAction[]
}

export interface ChatAction {
  label: string
  type: 'link' | 'flow'
  target: string
}

export interface ChatSession {
  sessionId: string
  messages: ChatMessage[]
  context?: {
    orderId?: string
    currentPage?: string
  }
}
