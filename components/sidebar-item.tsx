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

  const isActive = pathname === `/aivy/chat/${chat.Session_id}`
  // const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive

  if (!chat?.Session_id) return null

  const handleChatClick = (chatId: string) => {
    router.push(`/aivy/chat/${chatId}`) // Dynamic route with chat ID
  }

  return (
    <motion.div
      className={`relative ${accordian ? 'h-11' : 'h-8'}  cursor-pointer`}
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
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        {/* {chat.sharePath ? (
          <Tooltip delayDuration={1000}>
            <TooltipTrigger
              tabIndex={-1}
              className="focus:bg-muted focus:ring-1 focus:ring-ring"
            >
              <IconUsers className="mr-2 mt-1 text-white" />
            </TooltipTrigger>
            <TooltipContent>This is a shared chat.</TooltipContent>
          </Tooltip>
        ) : (
          <IconMessage className="mr-2 mt-1 text-white" />
        )} */}
        <IconMessage className="mr-2 mt-1 text-white" />
      </div>
      <div
        key={chat.Session_id}
        onClick={() => handleChatClick(chat.Session_id)}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-secondary dark:hover:bg-zinc-300/10',
          isActive && 'bg-secondary pr-16 font-semibold dark:bg-zinc-800'
        )}
      >
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
                  // onAnimationComplete={() => {
                  //   if (index === chat.header_name.length - 1) {
                  //     setNewChatId(null)
                  //   }
                  // }}
                  className="text-white"
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span className="text-white">{chat.header_name}</span>
            )}
          </span>
        </div>
      </div>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}
