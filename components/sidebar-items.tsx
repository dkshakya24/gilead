'use client'

import { SideBarChat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { removeChat, shareChat, editChat } from '@/app/actions'

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
                  removeChat={removeChat}
                  editChat={async (args: {
                    Session_id: string
                    header_name: string
                  }) => {
                    try {
                      await editChat(args)
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
