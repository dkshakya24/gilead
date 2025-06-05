'use client'

import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { cache, useEffect, useState } from 'react'
import { API_URL, PROJECT_NAME } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import Shimmer from './shimmer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './accordian'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

export function SidebarList({ userId }: SidebarListProps) {
  const [todaychats, setTodayChats] = useState([])
  const [otherchats, setOtherChats] = useState([])
  const [loading, setLoading] = useState(true)
  const path = usePathname()
  // console.log('pathssss', path.length, todaychats)
  const payload = {
    body: '{}',
    headers: {
      'User-Id': userId
    }
  }

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/${PROJECT_NAME}_getchathistory`,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      )
      const data = await response.json()
      setTodayChats(data?.body?.today)
      setOtherChats(data?.body?.others)
      if (response.ok) {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchChatHistory()
  }, [])

  useEffect(() => {
    if (path.length > 1) {
      const interval = setInterval(fetchChatHistory, 5000)
      setTimeout(() => {
        clearInterval(interval)
        console.log('Interval cleared')
      }, 60000)
    }
  }, [path.length])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {loading ? (
          <Shimmer />
        ) : (
          <div className="space-y-2 px-2">
            {todaychats && (
              <>
                <div className="flex items-center justify-between p-4">
                  <h4 className="text-sm font-medium text-gray-400">Today</h4>
                </div>
                <SidebarItems chats={todaychats} />
              </>
            )}
            {otherchats && (
              <>
                {/* Design 3: Card Style Accordion for Previous Chats */}
                <div>
                  <Accordion
                    type="single"
                    collapsible
                    // defaultValue="previous-chats"
                    className="bg-white/5 rounded-lg shadow-sm mt-4"
                  >
                    <AccordionItem
                      value="previous-chats"
                      className="border-none"
                    >
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800/30 rounded-t-lg">
                        <div className="flex items-center gap-2">
                          Previous Chats
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-0">
                        <SidebarItems chats={otherchats} accordian={true} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </>
            )}
          </div>
        )}
        {/* {otherchats?.length ? (
          <>
            <div className="space-y-2 px-2">
              <SidebarItems chats={otherchats} />
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-white">No chat history</p>
          </div>
        )} */}
      </div>
      <div className="flex items-center justify-between p-4">
        {/* <ThemeToggle /> */}
        {/* <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} /> */}
      </div>
    </div>
  )
}
