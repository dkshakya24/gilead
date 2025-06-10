'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import logoicon from '@/public/GL.svg'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { usePathname, useRouter } from 'next/navigation'
import { CiGlobe } from 'react-icons/ci'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowUp01Icon } from 'lucide-react'
import Image from 'next/image'
import ReasoningFactor from './gilead/reasoning-factor'
import { UrlDropdown } from './gilead/url-dropdown'
import { KeywordsDropdown } from './gilead/keywords-dropdown'

export function PromptForm({
  input,
  setInput,
  onSubmit,
  isStreaming
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isStreaming?: boolean
}) {
  const path = usePathname()
  const { formRef, onKeyDown } = useEnterSubmit()
  const agent = localStorage.getItem('agent')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [hasSubmitted, setHasSubmitted] = React.useState(false)
  const [webSearch, setWebSearch] = React.useState(() => {
    // Initialize from localStorage if available, otherwise false
    if (typeof window !== 'undefined') {
      if (path === '/arc') {
        return true
      } else {
        return false
      }
    }
  })

  const [isFocused, setIsFocused] = React.useState(false)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    if (webSearch) {
      localStorage.setItem('agent', 'websearch')
    } else {
      localStorage.setItem('agent', '')
    }
  }, [webSearch])

  return (
    <motion.form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        if (isStreaming) return

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return
        setHasSubmitted(true)
        onSubmit()
      }}
      className="w-full max-w-4xl mx-auto px-2 pb-1 fixed bottom-0 left-0 right-0  md:relative md:bottom-auto md:left-auto md:right-auto z-[999] md:z-50"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {!hasSubmitted && path === '/arc' ? (
        <div className="w-full bg-white rounded-2xl p-6 flex flex-col mt-4 w-[700px] shadow-md border border-gray-200 rounded-xl p-4">
          <textarea
            className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-gray-400 mb-6"
            placeholder="Ask Anything here..."
            value={input}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={e => setInput(e.target.value)}
            rows={2}
            disabled={isStreaming}
          />
          <div className="flex items-center gap-3 mt-auto">
            {/* <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 text-base text-gray-700 bg-white">
              Reasoning Factor:{' '}
              <span className="ml-2 text-red-600 font-semibold">HIGH</span>
              <svg
                className="ml-2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <button
              type="button"
              className="flex items-center border border-gray-200 rounded-full px-4 py-2 text-base text-gray-700 bg-white"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 7v6a4 4 0 01-8 0V7"
                />
                <rect width="20" height="12" x="2" y="7" rx="2" />
              </svg>
              URL
            </button>
            <button
              type="button"
              className="flex items-center border border-gray-200 rounded-full px-4 py-2 text-base text-gray-700 bg-white"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Keywords
            </button> */}
            <ReasoningFactor disabled />
            <UrlDropdown disabled />
            <KeywordsDropdown disabled />
            <button
              type="submit"
              className="ml-auto rounded-full w-12 h-12 flex items-center justify-center bg-[#C7203A] text-white shadow-none border-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              'relative flex items-center bg-white md:flex w-full grow overflow-hidden rounded-3xl border border-gray-200 transition-all duration-200 md:pr-0 pr-[10px]',
              isFocused ? 'shadow-md' : 'shadow-sm'
            )}
          >
            {/* Plus button (disabled) */}
            <div className="items-center pl-4 hidden md:flex">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image className="w-full" src={logoicon} alt="icon" />
              </div>
            </div>

            {/* Textarea input */}
            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask your question here and hit enter"
              className="min-h-[60px] max-h-[100px] bg-white overflow-auto w-full resize-none px-2 py-4 focus-within:outline-none text-base"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
            />

            {/* Tools/Features */}
            <div className="flex items-center gap-x-1 justify-between md:justify-end p-0 md:p-4">
              {/* Search button */}
              {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setWebSearch(!webSearch)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-x-1.5 h-9 hover:no-underline',
                    webSearch
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <CiGlobe size={16} />
                  <div className="hidden md:block">Search</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search the web</TooltipContent>
            </Tooltip> */}

              {/* Arrow button - Send */}
              <Button
                type="submit"
                size="icon"
                disabled={input === '' || isStreaming}
                className={cn(
                  'rounded-full md:w-10 md:h-10 w-8 h-8 flex items-center justify-center transition-all duration-200 ml-1 bg-primary text-white',
                  input === '' || isStreaming
                    ? 'opacity-40 cursor-not-allowed'
                    : 'opacity-100'
                )}
              >
                <ArrowUp className=" md:w-5 md:h-5 w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-500 mt-auto flex min-h-4 w-full items-center justify-center p-2 text-center text-xs md:px-[60px]">
            AI-generated content — verify important information independently.
          </p>
        </>
      )}
    </motion.form>
  )
}
