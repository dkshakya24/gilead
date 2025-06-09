import { create } from 'zustand'

interface AppState {
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
}

export const useStore = create<AppState>(set => ({
  isStreaming: false,
  setIsStreaming: isStreaming => set({ isStreaming })
}))
