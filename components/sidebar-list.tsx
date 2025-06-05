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
  search?: string
}

export function SidebarList({ userId, search = '' }: SidebarListProps) {
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

  const filterChats = (chats: any[]) =>
    chats?.filter(chat =>
      chat?.header_name?.toLowerCase().includes(search.toLowerCase())
    )

  const filteredTodayChats = filterChats(todaychats)
  const filteredOtherChats = filterChats(otherchats)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {loading ? (
          <Shimmer />
        ) : (
          <div className="space-y-4 px-1">
            {filteredTodayChats && filteredTodayChats.length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4 pb-2">
                  <h4 className="text-sm font-medium text-[#7893A4]">Today</h4>
                </div>
                <div className="shadow-sm">
                  <SidebarItems chats={filteredTodayChats} />
                </div>
              </>
            )}
            {filteredOtherChats && filteredOtherChats.length > 0 && (
              <>
                <div className="pt-2">
                  <Accordion type="single" collapsible className="mt-1">
                    <AccordionItem
                      value="previous-chats"
                      className="border-none"
                    >
                      <AccordionTrigger className="py-3 text-xs font-bold uppercase tracking-wider truncate text-[#72737C]">
                        <div className="flex items-center gap-2">
                          Previous Chats
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 pt-0">
                        <SidebarItems
                          chats={filteredOtherChats}
                          accordian={true}
                        />
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
