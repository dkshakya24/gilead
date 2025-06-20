'use client'

import { Sidebar } from '@/components/sidebar'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { SidebarFooter } from '@/components/sidebar-footer'
import { Button } from '@/components/ui/button'
import { IconPlus, IconMessage } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { signOut } from '@/auth'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { useSidebar } from '@/lib/hooks/use-sidebar'

// Presentational component
export function SidebarDesktop({
  session,
  isSidebarOpen,
  toggleSidebar
}: {
  session: Session | null
  isSidebarOpen: boolean
  toggleSidebar: () => void
}) {
  const router = useRouter()

  // Handler for sign out
  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="fixed inset-y-0 left-0 z-40 flex flex-col items-center bg-white/90 dark:bg-zinc-900/90 shadow-xl border-r min-w-[60px] lg:min-w-[60px] xl:min-w-[60px]">
      {/* Sidebar Toggle Button */}
      <div className="mt-4 mb-2">
        <SidebarToggle />
      </div>
      {/* Collapsed State: Show vertical icon stack */}
      {!isSidebarOpen && (
        <div className="flex flex-col items-center gap-6 mt-8">
          {/* New Chat */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => router.push('/new')}
            aria-label="New Chat"
          >
            <IconPlus className="w-6 h-6" />
          </Button>
          {/* Chat History */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => router.push('/')}
            aria-label="Chat History"
          >
            <IconMessage className="w-6 h-6" />
          </Button>
        </div>
      )}
      {/* Expanded State: Show full sidebar */}
      {isSidebarOpen && (
        <div className="w-[200px] xl:w-[320px] h-full flex flex-col">
          <Sidebar className="h-full flex flex-col">
            <ChatHistory userId={session?.user?.email} />
            <SidebarFooter>
              <Button
                variant="ghost"
                className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                onClick={handleSignOut}
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
              </Button>
            </SidebarFooter>
          </Sidebar>
        </div>
      )}
    </div>
  )
}

// Container component
export default function SidebarDesktopContainer({
  session
}: {
  session: Session | null
}) {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  return (
    <SidebarDesktop
      session={session}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  )
}
