import { create } from 'zustand'
import { ChatMessage } from '@/lib/types'

interface AppState {
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
  reasoning: string
  setReasoning: (reasoning: string) => void
  chatMessages: ChatMessage[]
  setChatMessages: (messages: ChatMessage[]) => void
  chatId: string
  setChatId: (id: string) => void
  selectedUrls: string[]
  setSelectedUrls: (urls: string[]) => void
}

export const useStore = create<AppState>(set => ({
  isStreaming: false,
  setIsStreaming: isStreaming => set({ isStreaming }),
  reasoning: 'Low',
  setReasoning: reasoning => set({ reasoning }),
  chatMessages: [],
  setChatMessages: messages => set({ chatMessages: messages }),
  chatId: '',
  setChatId: id => set({ chatId: id }),
  selectedUrls: [],
  setSelectedUrls: urls => set({ selectedUrls: urls })
}))
