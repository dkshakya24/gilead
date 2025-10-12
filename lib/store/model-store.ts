import { create } from 'zustand'

interface ModelState {
  selectedModel: 'claude-sonnet-4' | 'gpt-4.1'
  cloudProvider: 'aws' | 'azure'
  llmModel: string
  setSelectedModel: (model: 'claude-sonnet-4' | 'gpt-4.1') => void
}

export const useModelStore = create<ModelState>((set) => ({
  selectedModel: 'claude-sonnet-4',
  cloudProvider: 'aws',
  llmModel: 'claude 4 sonnet',
  setSelectedModel: (model) => 
    set({
      selectedModel: model,
      cloudProvider: model === 'claude-sonnet-4' ? 'aws' : 'azure',
      llmModel: model === 'claude-sonnet-4' ? 'claude 4 sonnet' : 'gpt 4.1'
    })
}))