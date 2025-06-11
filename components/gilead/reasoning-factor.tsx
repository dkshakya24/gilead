'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '../ui/button'
import { InfoCircledIcon } from '@radix-ui/react-icons'

export default function ReasoningFactor({ disabled }: { disabled: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const reasoningOptions = ['High', 'Medium', 'Low'] as const
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { reasoning, setReasoning } = useStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center px-3 py-2 w-[226px] border ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } border-gray-300 rounded-3xl text-sm text-gray-700`}
        onClick={() => {
          if (!disabled) setIsDropdownOpen(!isDropdownOpen)
        }}
        disabled={disabled}
      >
        Reasoning Factor:
        <span className="ml-2 text-[#C5203F] font-medium">{reasoning}</span>
        {reasoning === 'High' && (
          // <div className="relative group ml-2">

          //   <svg
          //     xmlns="http://www.w3.org/2000/svg"
          //     className="h-4 w-4 text-gray-400"
          //     fill="none"
          //     viewBox="0 0 24 24"
          //     stroke="currentColor"
          //   >
          //     <path
          //       strokeLinecap="round"
          //       strokeLinejoin="round"
          //       strokeWidth={2}
          //       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          //     />
          //   </svg>
          //   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          //     High reasoning provides more detailed and thorough responses
          //   </div>
          // </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircledIcon className="ml-1" />
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-white border border-primary text-gray-600"
            >
              High reasoning enables deeper insights <br />
              but may take a bit more time to process.
            </TooltipContent>
          </Tooltip>
        )}
        <ChevronDown
          className={`w-[17px] h-[17px] ml-auto transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && !disabled && (
        <div className="absolute top-full left-0 -mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200 w-full min-w-[160px]">
          {reasoningOptions.map(option => (
            <button
              key={option}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                reasoning === option
                  ? 'bg-gray-50 text-[#C5203F] font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                setReasoning(option)
                setIsDropdownOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
