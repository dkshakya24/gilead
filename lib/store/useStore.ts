import { create } from 'zustand'

interface ChatMessage {
  sender: string
  message: string
  chatId?: string
  responseTime?: any
  citations?: any
  createdTime?: string
  isRetried?: boolean
  retryReason?: string
  retryHistory?: {
    version: number
    message: string
    responseTime?: string
    createdTime: string
    retryReason: string
    citations?: any
  }[]
  currentVersion?: number
}

interface AppState {
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
  reasoning: 'High' | 'Medium' | 'Low'
  setReasoning: (reasoning: 'High' | 'Medium' | 'Low') => void
  chatMessages: ChatMessage[]
  setChatMessages: (messages: ChatMessage[]) => void
  chatId: string
  setChatId: (id: string) => void
}

export const useStore = create<AppState>(set => ({
  isStreaming: false,
  setIsStreaming: isStreaming => set({ isStreaming }),
  reasoning: 'Low',
  setReasoning: reasoning => set({ reasoning }),
  chatMessages: [],
  setChatMessages: messages => set({ chatMessages: messages }),
  chatId: '',
  setChatId: id => set({ chatId: id })
}))
