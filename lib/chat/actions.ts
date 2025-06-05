import 'server-only'

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  sender: string
  message: string
  chatId?: string
  sourceData?: any
  citations?: any
}[]
