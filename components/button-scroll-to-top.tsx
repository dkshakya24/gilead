'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconArrowDown } from '@/components/ui/icons'

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean
  scrollToTop: () => void
}

export function ButtonScrollToTop({
  className,
  isAtBottom,
  scrollToTop,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed right-4 bottom-24 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-opacity duration-300 sm:right-8',
        isAtBottom ? 'opacity-100' : 'opacity-0',
        className
      )}
      onClick={() => scrollToTop()}
      {...props}
    >
      <IconArrowDown className="rotate-180" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}
