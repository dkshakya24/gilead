import * as React from 'react'

import Link from 'next/link'
// import { Session } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { auth } from '@/auth'
import { DownloadIcon } from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
interface ChatHistoryProps {
  userId?: string
}

import ChatHistoryHeader from './chathistory-header'

export function ChatHistory({ userId }: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      <ChatHistoryHeader userId={userId} />
    </div>
  )
}
