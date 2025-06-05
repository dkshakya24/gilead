'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()

  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(
        className,
        'h-full flex-col bg-white/90 rounded-2xl shadow-xl p-2 m-2 border border-border min-w-[260px] max-w-[320px] transition-all duration-300 dark:bg-zinc-900/90'
      )}
    >
      {children}
    </div>
  )
}
