'use client'

import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { cache, useEffect, useState, useCallback, useRef } from 'react'
import { API_URL, PROJECT_NAME } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import Shimmer from './shimmer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './accordian'
import { useWebSocketStore } from '@/lib/store/websocket-store'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
  search?: string
}

// Cache to store chat history data
const chatHistoryCache = new Map()

export function SidebarList({ userId, search = '' }: SidebarListProps) {
  const [todaychats, setTodayChats] = useState([])
  const [otherchats, setOtherChats] = useState([])
  const [loading, setLoading] = useState(true)
  const path = usePathname()
  const hasInitialized = useRef(false)
  // console.log('pathssss', path.length, todaychats)

  const fetchChatHistory = useCallback(async () => {
    // Check if we already have cached data for this user
    if (chatHistoryCache.has(userId)) {
      const cachedData = chatHistoryCache.get(userId)
      setTodayChats(cachedData.today || [])
      setOtherChats(cachedData.others || [])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/get-chat-history?user_id=${userId}`,
        {
          method: 'GET'
        }
      )
      const data = await response.json()

      // Cache the data
      chatHistoryCache.set(userId, {
        today: data?.today || [],
        others: data?.others || []
      })

      setTodayChats(data?.today || [])
      setOtherChats(data?.others || [])
      if (response.ok) {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }, [userId])

  const isStreaming = useWebSocketStore(state => state.isStreaming)
  const refreshChatHistory = useWebSocketStore(
    state => state.refreshChatHistory
  )
  const setRefreshChatHistory = useWebSocketStore(
    state => state.setRefreshChatHistory
  )

  useEffect(() => {
    // Only fetch on first render or when userId changes
    if (!hasInitialized.current && userId) {
      hasInitialized.current = true
      fetchChatHistory()
    }
  }, [userId]) // Remove fetchChatHistory and isStreaming from dependencies

  // Refresh chat history when streaming starts (new chat begins)
  useEffect(() => {
    if (!isStreaming && userId) {
      // Clear cache and refetch when new chat starts
      chatHistoryCache.delete(userId)
      fetchChatHistory()
    }
  }, [isStreaming])

  // Refresh chat history when edit is completed
  useEffect(() => {
    if (refreshChatHistory && userId) {
      // Clear cache and refetch when chat is edited
      chatHistoryCache.delete(userId)
      fetchChatHistory()
      setRefreshChatHistory(false) // Reset the trigger
    }
  }, [refreshChatHistory, userId, setRefreshChatHistory])

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
                      <AccordionTrigger className="py-3 text-sm hover:bg-gray-100 px-2 rounded-md tracking-wider truncate text-[#72737C]">
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
