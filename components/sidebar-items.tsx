'use client'

import { SideBarChat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { editChatClient, removeChatClient } from '@/lib/chat/client-actions'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

interface SidebarItemsProps {
  chats?: SideBarChat[]
  accordian?: boolean
}

export function SidebarItems({ chats, accordian }: SidebarItemsProps) {
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
                      await removeChatClient({
                        Session_id: args.Session_id,
                        user_id: chat.user_id || ''
                      })
                    } catch (error) {
                      console.error('Failed to remove chat:', error)
                    }
                  }}
                  editChat={async (args: {
                    Session_id: string
                    header_name: string
                  }) => {
                    try {
                      await editChatClient({
                        Session_id: args.Session_id,
                        header_name: args.header_name,
                        user_id: chat.user_id || ''
                      })
                    } catch (error) {
                      console.error('Failed to edit chat:', error)
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
