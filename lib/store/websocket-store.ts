import { create } from 'zustand'

interface WebSocketState {
  isStreaming: boolean
  setIsStreaming: (value: boolean) => void
  ragStreaming: boolean
  setRagStreaming: (value: boolean) => void
  isSuggestions: boolean
  setIsSuggestions: (value: boolean) => void
  retried: boolean
  setRetried: (value: boolean) => void
  retriedAnswers?:
    | Array<{ retry_reason: string; answer: string; responseTime?: string }>
    | string[]
  setRetriedAnswers: (
    answers:
      | Array<{ retry_reason: string; answer: string; responseTime?: string }>
      | string[]
  ) => void
  currentRetryReason: string | null
  setCurrentRetryReason: (reason: string | null) => void
  refreshChatHistory: boolean
  setRefreshChatHistory: (value: boolean) => void
}

export const useWebSocketStore = create<WebSocketState>(set => ({
  isStreaming: false,
  setIsStreaming: value => set({ isStreaming: value }),
  ragStreaming: true,
  setRagStreaming: value => set({ ragStreaming: value }),
  isSuggestions: true,
  setIsSuggestions: value => set({ isSuggestions: value }),
  retried: false,
  setRetried: value => set({ retried: value }),
  retriedAnswers: [],
  setRetriedAnswers: answers => set({ retriedAnswers: answers }),
  currentRetryReason: null,
  setCurrentRetryReason: reason => set({ currentRetryReason: reason }),
  refreshChatHistory: false,
  setRefreshChatHistory: value => set({ refreshChatHistory: value })
}))
