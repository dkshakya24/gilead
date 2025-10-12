'use client'

import * as React from 'react'
import Image from 'next/image'
import { useModelStore } from '@/lib/store/model-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export type LLMModel = 'claude-sonnet-4' | 'gpt-4.1'

interface LLMModelDropdownProps {
  disabled?: boolean
}

export function LLMModelDropdown({
  disabled = false
}: LLMModelDropdownProps) {
  const { selectedModel, setSelectedModel } = useModelStore()

  return (
    <Select
      value={selectedModel}
      onValueChange={setSelectedModel}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">Model</span>
        <SelectTrigger className="w-[60px] h-[38px] rounded-full border-0 bg-gray-100/80 hover:bg-gray-200/80 transition-colors p-1.5">
        <SelectValue placeholder="Select LLM Model">
          {selectedModel && (
            <div className="flex items-center justify-center">
              {selectedModel === 'claude-sonnet-4' ? (
                <img src="/anthropic.png" alt="Claude Icon" className="w-6 h-6" />
              ) : (
                <img src="/gpt.png" alt="GPT Icon" className="w-6 h-6" />
              )}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      </div>
      <SelectContent className="rounded-xl border-0 bg-gray-100/80 shadow-lg min-w-[270px] p-2">
        <SelectItem value="claude-sonnet-4" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/anthropic.png" alt="Claude Icon" className="w-7 h-7" />
            <span>Claude Sonnet 4</span>
          </div>
        </SelectItem>
        <SelectItem value="gpt-4.1" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/gpt.png" alt="GPT Icon" className="w-7 h-7" />
            <span>GPT 5</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )

}
