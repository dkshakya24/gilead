'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ReasoningFactor({ disabled }: { disabled: boolean }) {
  const [reasoning, setReasoning] = useState('HIGH')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const reasoningOptions = ['HIGH', 'MEDIUM', 'LOW']
  const dropdownRef = useRef<HTMLDivElement>(null)

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
