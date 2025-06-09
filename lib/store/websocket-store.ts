import { create } from 'zustand'

interface WebSocketState {
  isStreaming: boolean
  setIsStreaming: (value: boolean) => void
  ragStreaming: boolean
  setRagStreaming: (value: boolean) => void
}

export const useWebSocketStore = create<WebSocketState>(set => ({
  isStreaming: false,
  setIsStreaming: value => set({ isStreaming: value }),
  ragStreaming: true,
  setRagStreaming: value => set({ ragStreaming: value })
}))
