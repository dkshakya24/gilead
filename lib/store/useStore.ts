import { create } from 'zustand'

interface AppState {
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
  reasoning: 'High' | 'Medium' | 'Low'
  setReasoning: (reasoning: 'High' | 'Medium' | 'Low') => void
}

export const useStore = create<AppState>(set => ({
  isStreaming: false,
  setIsStreaming: isStreaming => set({ isStreaming }),
  reasoning: 'High',
  setReasoning: reasoning => set({ reasoning })
}))
