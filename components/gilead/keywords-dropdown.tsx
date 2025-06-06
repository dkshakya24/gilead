'use client'

import * as React from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type Keyword = {
  id: string
  text: string
}

export function KeywordsDropdown({ disabled }: { disabled: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [keywords, setKeywords] = React.useState<Keyword[]>([
    { id: '1', text: 'Keyword 1' },
    { id: '2', text: 'Keyword 2' },
    { id: '3', text: 'Keyword 3' }
  ])

  const [selectedKeywords, setSelectedKeywords] = React.useState<string[]>([])

  const toggleKeyword = (id: string) => {
    setSelectedKeywords(prev =>
      prev.includes(id)
        ? prev.filter(keywordId => keywordId !== id)
        : [...prev, id]
    )
  }

  const deleteKeyword = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setKeywords(prev => prev.filter(keyword => keyword.id !== id))
  }

  return (
    <DropdownMenu onOpenChange={open => !disabled && setIsDropdownOpen(open)}>
      <DropdownMenuTrigger asChild>
        <button
          // disabled={disabled}
          className={`flex h-[38px] items-center gap-x-2 px-3 py-2 rounded-3xl border text-sm transition
            ${
              disabled
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border-gray-200 cursor-pointer'
            }`}
        >
          <span>Keywords</span>
          <ChevronDown
            className={`transition-transform duration-200 w-4 h-4 ${
              !disabled && isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      {!disabled && (
        <DropdownMenuContent className="w-[400px] p-3 rounded-xl">
          <div className="p-0">
            {keywords.map((keyword, index) => (
              <div
                key={keyword.id}
                className={`flex items-center gap-3 p-3 ${
                  keywords.length === index + 1
                    ? ''
                    : 'border-b-2 border-gray-200'
                } hover:bg-gray-50 cursor-pointer`}
                onClick={() => toggleKeyword(keyword.id)}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedKeywords.includes(keyword.id)}
                    onChange={e => e.preventDefault()}
                    className="h-4 w-4 rounded cursor-pointer border-gray-300"
                  />
                </div>
                <div className="flex-1 font-medium">{keyword.text}</div>
                <button
                  onClick={e => deleteKeyword(keyword.id, e)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-red-50 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-[#C5203F]" />
                </button>
              </div>
            ))}

            <button className="flex cursor-pointer items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl">
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add Keyword</span>
            </button>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
