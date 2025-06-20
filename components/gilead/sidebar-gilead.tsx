'use client'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import React from 'react'
import { SidebarToggle } from '../sidebar-toggle'
import { Button } from '../ui/button'
import { IconMessage, IconPlus } from '../ui/icons'
import { Session } from '@/lib/types'
import { Sidebar } from '../sidebar'
import { ChatHistory } from '../chat-history'
import { SidebarFooter } from '../sidebar-footer'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

const SidebarGilead = ({
  session
  // handleSignOut
}: {
  session: Session | null
  //   isSidebarOpen: boolean
  // handleSignOut: () => void
}) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  // Handler for sign out

  const router = useRouter()
  return (
    <div className="hidden sm:flex relative inset-y-0 left-0 z-40 flex-col items-center bg-white/90 dark:bg-zinc-900/90 shadow-xl border-r min-w-[60px] lg:min-w-[60px] xl:min-w-[60px] z-[999]">
      {/* Sidebar Toggle Button */}
      {/* <div className="mt-4 mb-2">
        <SidebarToggle />
      </div> */}
      {/* Collapsed State: Show vertical icon stack */}
      {!isSidebarOpen && (
        <div className="flex flex-col items-center gap-6 mt-8">
          {/* New Chat */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => (window.location.href = '/new')}
                aria-label="New Chat"
              >
                <IconPlus className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Tooltip>

          {/* Chat History */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={toggleSidebar}
                aria-label="Chat History"
              >
                <IconMessage className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Chat History</TooltipContent>
          </Tooltip>
        </div>
      )}
      {/* Expanded State: Show full sidebar */}
      {isSidebarOpen && (
        <div className="w-auto h-full flex flex-col">
          <Sidebar className="h-full flex flex-col">
            <ChatHistory userId={session?.user?.email} />
            <SidebarFooter>
              {/* <Button
                variant="ghost"
                className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                // onClick={handleSignOut}
                aria-label="Sign Out"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                <span className="ml-2">Sign Out</span>
              </Button> */}
            </SidebarFooter>
          </Sidebar>
        </div>
      )}
    </div>
  )
}

export default SidebarGilead
