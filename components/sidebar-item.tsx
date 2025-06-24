'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { buttonVariants } from '@/components/ui/button'
import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { SideBarChat, type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useWebSocketStore } from '@/lib/store/websocket-store'
import { useStore } from '@/lib/store/useStore'

interface SidebarItemProps {
  index: number
  chat: SideBarChat
  children: React.ReactNode
  accordian?: boolean
}

export function SidebarItem({
  index,
  chat,
  children,
  accordian
}: SidebarItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setIsStreaming } = useWebSocketStore()
  const { setChatMessages } = useStore()
  const isActive = pathname === `/arc/chat/${chat.Session_id}`
  // const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive

  // Format time
  let timeString = ''
  if (chat.created_on) {
    try {
      timeString = format(new Date(chat.created_on), 'hh:mm aa')
    } catch {}
  }

  if (!chat?.Session_id) return null

  const handleChatClick = (chatId: string) => {
    setChatMessages([]) // Clear existing messages before switching chats
    router.push(`/arc/chat/${chatId}`) // Dynamic route with chat ID
    setIsStreaming(false)
  }

  return (
    <motion.div
      className={`relative ${accordian ? 'h-12' : 'h-10'} cursor-pointer`}
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      {/* Active indicator bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all ${isActive ? 'bg-primary' : 'bg-transparent'}`}
      ></div>
      <div
        key={chat.Session_id}
        onClick={() => handleChatClick(chat.Session_id)}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-[10px] py-2 my-1 rounded-xl bg-white/80 transition-colors  hover:bg-[#f7f7f7] text-gray-800 font-medium text-sm flex items-center',
          isActive && 'bg-[#F7F7F7] text-primary font-bold',
          accordian && 'h-12'
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-[8px] bottom-[8px] w-1 bg-[#C5203F] rounded-r"></span>
        )}
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.header_name}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.header_name.split('').map((character: any, index: any) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                  className="text-gray-800"
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span className="text-gray-600">{chat.header_name}</span>
            )}
          </span>
        </div>
        {/* Time on the right */}
        <span className="ml-2 text-xs text-gray-400 font-normal flex-shrink-0">
          {timeString}
        </span>
      </div>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}
