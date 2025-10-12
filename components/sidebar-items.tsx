'use client'

import { SideBarChat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'

import { editChatClient, removeChatClient } from '@/lib/chat/client-actions'
import { useStore } from '@/lib/store/useStore'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

interface SidebarItemsProps {
  chats?: SideBarChat[]
  accordian?: boolean
}

export function SidebarItems({ chats, accordian }: SidebarItemsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setChatMessages } = useStore()

  if (!chats?.length) return null

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.Session_id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} chat={chat} accordian={accordian}>
                <SidebarActions
                  chat={chat}
                  removeChat={async (args: { Session_id: string }) => {
                    try {
                      const result = await removeChatClient({
                        Session_id: args.Session_id,
                        user_id: chat.user_id || ''
                      })

                      if (result && 'error' in result) {
                        return result
                      }

                      // Clear chat messages if we're currently viewing the deleted chat
                      if (pathname === `/arc/chat/${args.Session_id}`) {
                        setChatMessages([])
                      }

                      return
                    } catch (error) {
                      console.error('Failed to remove chat:', error)
                      return {
                        error:
                          error instanceof Error
                            ? error.message
                            : 'Failed to remove chat'
                      }
                    }
                  }}
                  editChat={async (args: {
                    Session_id: string
                    header_name: string
                  }) => {
                    try {
                      const result = await editChatClient({
                        Session_id: args.Session_id,
                        header_name: args.header_name,
                        user_id: chat.user_id || ''
                      })

                      if (result && 'error' in result) {
                        return result
                      }

                      return
                    } catch (error) {
                      console.error('Failed to edit chat:', error)
                      return {
                        error:
                          error instanceof Error
                            ? error.message
                            : 'Failed to edit chat'
                      }
                    }
                  }}
                  // shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
