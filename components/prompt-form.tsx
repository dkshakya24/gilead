'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import logoicon from '@/public/GileadLogo.svg'
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
  const router = useRouter()
  const path = usePathname()
  const { formRef, onKeyDown } = useEnterSubmit()
  const agent = localStorage.getItem('agent')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [webSearch, setWebSearch] = React.useState(() => {
    // Initialize from localStorage if available, otherwise false
    if (typeof window !== 'undefined') {
      if (path === '/aivy' && agent === 'websearch') {
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
        onSubmit()
      }}
      className="w-full max-w-4xl mx-auto px-2 pb-4 fixed bottom-0 left-0 right-0 bg-background md:relative md:bottom-auto md:left-auto md:right-auto z-[999] md:z-50"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          'relative flex items-center md:flex w-full grow overflow-hidden bg-background rounded-3xl border border-gray-200 transition-all duration-200 md:pr-0 pr-[10px]',
          isFocused ? 'shadow-md' : 'shadow-sm'
        )}
      >
        {/* Plus button (disabled) */}
        <div className="items-center pl-4 hidden md:flex">
          <div className="w-6 h-6 flex items-center justify-center">
            <Image className="w-full p-[1px]" src={logoicon} alt="icon" />
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
          className="min-h-[60px] max-h-[100px] overflow-auto w-full resize-none bg-transparent px-2 py-4 focus-within:outline-none text-base"
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
    </motion.form>
  )
}
