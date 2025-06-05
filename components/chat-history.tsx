import * as React from 'react'

import Link from 'next/link'
// import { Session } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/sidebar-list'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { auth } from '@/auth'
import { DownloadIcon } from '@radix-ui/react-icons'
interface ChatHistoryProps {
  userId?: string
}
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
export async function ChatHistory({ userId }: ChatHistoryProps) {
  const session = await auth()
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium text-white">Chat History</h4>
        {session?.user?.email === 'admin@chryselys.com' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className="px-3 py-1 bg-white rounded "
                href="https://jkoyck2bh2pgvahhzvrbeavgza0rrtit.lambda-url.us-east-1.on.aws"
                download={true}
              >
                <DownloadIcon className="text-xl text-primary text-bold" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="z-100">
              Download All Chat
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="mb-2 px-2">
        <Link
          href="/new"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
          )}
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          Start a New Chat
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList userId={userId} />
      </React.Suspense>
    </div>
  )
}
