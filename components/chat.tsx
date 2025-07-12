'use client'

import { FEEDBACK_API, SUGGESTION_API, WEBSOCKET, cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Session, ChatMessage } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import useWebSocket from '@/lib/hooks/useWebSocket'
import Annotations from './messages-component/annotations'
import { MdOutlineInsertComment } from 'react-icons/md'
import { Button } from './ui/button'
import { useStore } from '@/lib/store/useStore'
import { toast } from 'sonner'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export interface ChatProps {
  id?: string
  className?: string
  initialMessages?: any
  session: Session
}
interface RetryAnswer {
  answer: string
  retry_reason?: string
  responseTime?: string
}

interface ChatData {
  messages?: Array<{
    message: Array<{
      role: 'user' | 'assistant'
      content: string
      created_time: string
      responseTime?: string
      sources?: any[]
      specific_citations?: any[]
      retried_answers?: Array<{
        answer: string
        retry_reason?: string
        responseTime?: string
      }> | string[]
      retry_reason?: string
    }>
    message_id: string
    retried?: boolean
  }>
  Data?: string[]
  error?: string
}

export function Chat({ id, className, session, initialMessages }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const {
    reasoning,
    chatMessages,
    setChatMessages,
    chatId,
    setChatId,
    selectedUrls
  } = useStore()
  const {
    messages,
    sendMessage,
    isConnected,
    emptyMessages,
    isStreaming,
    chat_id,
    sourceData,
    citationsData,
    animation,
    ragStreaming,
    responseTime,
    retried,
    retriedAnswers
  } = useWebSocket(WEBSOCKET as string)
  const [input, setInput] = useState('')
  const [newchatboxId, setNewchatboxId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState<string[]>([])
  const [isBtnClicked, setIsBtnClicked] = useState(false)
  const [annotations, setAnnotations] = useState<any>()
  const [agent, setAgent] = useState<string>('')
  const [autoScrollInterval, setAutoScrollInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [dataKey, setDataKey] = useState<string[]>([])
  const [retryingChatId, setRetryingChatId] = useState<string | null>(null)
  const [retryReason, setRetryReason] = useState<string>('')
  const [isNewMessage, setIsNewMessage] = useState(false)

  // Add state for initial data loading
  const [isInitialFetch, setIsInitialFetch] = useState(true)

  const carouselRef = useRef<HTMLDivElement>(null)
  console.log(initialMessages, 'initialMessages')

  const startAutoScroll = useCallback(() => {
    if (carouselRef.current) {
      const interval = setInterval(() => {
        if (carouselRef.current) {
          const isAtEnd =
            carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >=
            carouselRef.current.scrollWidth
          if (isAtEnd) {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            carouselRef.current.scrollBy({ left: 290, behavior: 'smooth' })
          }
        }
      }, 3000) // Scroll every 3 seconds
      setAutoScrollInterval(interval)
    }
  }, [])
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval)
      setAutoScrollInterval(null)
    }
  }, [autoScrollInterval])
  useEffect(() => {
    if (!chatMessages.length) {
      startAutoScroll()
    }
    return () => stopAutoScroll()
  }, [])

  const handleAnnotations = async () => {
    try {
      const response = await fetch(
        `${FEEDBACK_API}/conversations/${id ? id : newchatboxId}/annotations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            user: `{"id":"${session?.user.email}"}`
          }
          // body: JSON.stringify(payload)
        }
      )
      const data = await response.json()
      console.log('Response:', data)
      if (response.ok) {
        setAnnotations(data.annotations)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }
  const handleannotationClicked = () => {
    setIsBtnClicked(true)
    handleAnnotations()
    // Show feedback form logic here
  }
  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (!id || !session?.user?.email || !isInitialFetch) return
      
      setIsLoading(true)
      try {
        const { getChatClient } = await import('@/lib/chat/client-actions')
        const data: ChatData = await getChatClient(id, session.user.email)
        
        if (data?.messages) {
          const chathistory: ChatMessage[] = []
          data.messages.forEach((chat) => {
            chat.message.forEach((item) => {
              if (item.role === 'user') {
                chathistory.push({
                  sender: 'user',
                  message: item.content,
                  createdTime: new Date(item.created_time)
                    .toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                    .replace(',', '')
                })
              } else if (item.role === 'assistant') {
                const retriedAnswers = item.retried_answers?.map((retry: any) => {
                  if (typeof retry === 'object' && retry.answer) {
                    return {
                      retry_reason: retry.retry_reason || '',
                      answer: retry.answer
                    }
                  }
                  return retry
                }) || []
                
                chathistory.push({
                  sender: 'receiver',
                  message: item.content,
                  chatId: chat.message_id,
                  responseTime: item.responseTime,
                  sourceData: item.sources || [],
                  citations: item.specific_citations || [],
                  createdTime: new Date(item.created_time)
                    .toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                    .replace(',', ''),
                  retried: chat.retried || false,
                  retriedAnswers: retriedAnswers,
                  retryReason: item.retry_reason,
                  isRetried: false
                })
              }
            })
          })
          
          if (data.Data) {
            setDataKey(data.Data)
          }
          setChatMessages(chathistory)
        } else if (data?.error) {
          if (data.error === 'No documents found for the provided User-Id and chatter_id') {
            // This is an expected case for new chats, don't show error
            console.log('No existing chat found')
          } else {
            toast.error('Failed to load chat', {
              position: 'top-right',
              className: 'bottom-auto'
            })
          }
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error)
        toast.error('Failed to load chat', {
          position: 'top-right',
          className: 'bottom-auto'
        })
      } finally {
        setIsLoading(false)
        setIsInitialFetch(false)
      }
    }

    fetchInitialMessages()
  }, [id, session?.user?.email, isInitialFetch, setChatMessages])

  // Reset isNewMessage flag after auto-scroll is triggered
  useEffect(() => {
    if (isNewMessage) {
      const timeoutId = setTimeout(() => {
        setIsNewMessage(false)
      }, 500) // Reset after 500ms to allow auto-scroll to complete

      return () => clearTimeout(timeoutId)
    }
  }, [isNewMessage])

  useEffect(() => {
    if (path === '/arc' && !newchatboxId) {
      let isMounted = true
      const fetchData = async () => {
        try {
          const response = await fetch('/utils/generate-id', {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache'
            }
          })
          const data = await response.json()
          if (isMounted) {
            setNewchatboxId(data.id)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
      return () => {
        isMounted = false
      }
    }
  }, [path, newchatboxId])

  // Get URL tracking state from localStorage
  const isUrlEnabled =
    typeof window !== 'undefined'
      ? localStorage.getItem('urlEnabled') !== 'false'
      : true

  const payload = {
    action: 'sendmessage',
    sessionId: id ? id : newchatboxId,
    query: input,
    userId: session?.user.email,
    reasoning: reasoning,
    urls: isUrlEnabled ? selectedUrls : []
  }

  const handleSend = () => {
    emptyMessages()
    setIsNewMessage(true) // Set to true when sending a new message
    const userMessage: ChatMessage = {
      sender: 'user',
      message: input,
      createdTime: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    // Only add the user message, let the useEffect handle bot responses
    const userMessages = [...chatMessages, userMessage]
    setChatMessages(userMessages)
    setChatId(chat_id)
    sendMessage(payload)
    setInput('')
    console.log(payload, 'payloadddd')
  }

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && chatMessages.length === 1) {
        window.history.replaceState({}, '', `/arc/chat/${newchatboxId}`)
      }
    }
  }, [newchatboxId, path, session?.user, chatMessages])

  const {
    messagesRef,
    scrollRef,
    visibilityRef,
    isAtBottom,
    scrollToBottom,
    scrollToTop
  } = useScrollAnchor()

  const handleRetry =
    (_msgIndex: number, userMessage: string, chatId: string) =>
    (reason: string) => {
      setRetryingChatId(chatId)
      setRetryReason(reason)

      // Find the original bot message and its corresponding user message
      const originalBotMessageIndex = chatMessages.findIndex(
        msg =>
          (msg.sender === 'receiver' || msg.sender === 'bot') &&
          msg.chatId === chatId
      )

      // Find the user message that corresponds to this bot message
      let correspondingUserMessage = null
      let userMessageIndex = -1

      if (originalBotMessageIndex !== -1) {
        // Look backwards from the bot message to find the user message
        for (let i = originalBotMessageIndex - 1; i >= 0; i--) {
          if (chatMessages[i].sender === 'user') {
            correspondingUserMessage = {
              ...chatMessages[i],
              isRetried: true,
              retryReason: reason
            }
            userMessageIndex = i
            break
          }
        }
      }

      const filteredMessages = chatMessages.filter((msg, index) => {
        if (index === originalBotMessageIndex) {
          return false
        }

        if (index === userMessageIndex) {
          return false
        }
        return true
      })

      const newMessages = [
        ...filteredMessages,
        ...(correspondingUserMessage ? [correspondingUserMessage] : [])
      ]

      setChatMessages(newMessages)

      const payload = {
        action: 'sendmessage',
        sessionId: id ? id : newchatboxId,
        query: userMessage,
        userId: session?.user.email,
        reasoning: reasoning,
        retry_reason: reason,
        messageId: chatId,
        urls: isUrlEnabled ? selectedUrls : []
      }
      emptyMessages()
      sendMessage(payload)
      console.log(payload, 'retry clickedone')
    }

  useEffect(() => {
    if (messages.length > 0 && !isStreaming && chat_id) {
      // Check if we already have a message with this chat_id to prevent duplicates
      const existingMessage = chatMessages.find(
        msg =>
          msg.chatId === chat_id &&
          (msg.sender === 'receiver' || msg.sender === 'bot')
      )

      // If we already have a complete message for this chat_id, don't add another
      if (existingMessage && existingMessage.message.length > 0) {
        return
      }

      const idx = chatMessages.findIndex(
        msg =>
          (msg.sender === 'receiver' || msg.sender === 'bot') &&
          msg.chatId === chat_id
      )
      const newBotMessage: ChatMessage = {
        sender: 'bot',
        message: messages.map((item: any) => item.message).join(''),
        chatId: chat_id,
        responseTime: responseTime,
        createdTime: new Date().toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        retried: retried,
        retriedAnswers: retriedAnswers as string[] | undefined
      }
      let updated
      if (idx !== -1) {
        // Update existing message (for retry scenarios)
        updated = [...chatMessages]
        updated[idx] = { ...updated[idx], ...newBotMessage }
      } else {
        // Add new message only if it doesn't already exist
        if (!existingMessage) {
          updated = [...chatMessages, newBotMessage]
        } else {
          updated = chatMessages
        }
      }
      setChatMessages(updated)
      setRetryingChatId(null)
      setRetryReason('')
    }
  }, [
    messages,
    isStreaming,
    chat_id,
    chatMessages,
    retryingChatId,
    retryReason,
    responseTime,
    retried,
    retriedAnswers
  ])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="group w-full pl-0 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[300px] peer-[[data-state=open]]:xl:pl-[340px] bg-[#fefcfe]">
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full justify-center">
        {chatMessages.length ? (
          <div className="flex-1 w-full h-full overflow-y-auto">
            <div className="w-full mx-auto mb-8 bg-white flex flex-col min-h-[70vh]">
              {/* Chat Header */}
              <div className="sticky top-0 z-10 left-0 right-0 h-[60px] bg-white flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  {/* <span className="text-xl font-semibold text-gray-800">
                    GILEAD AI Assistant
                  </span> */}
                </div>
                {/* Optional actions: export/share, etc. */}
                <div className="flex items-center gap-2 ml-2">
                  {chatMessages.length && !isBtnClicked && (
                    <Button
                      onClick={handleannotationClicked}
                      className="hover:bg-primary transition-colors p-2 sm:p-3"
                    >
                      <MdOutlineInsertComment className="w-5 h-5 text-white" />
                    </Button>
                  )}
                  {/* Add more action buttons here if needed */}
                </div>
              </div>
              {/* Chat List */}
              <div className="flex-1 w-full px-4 py-6 overflow-y-auto">
                <ChatList
                  messages={
                    isStreaming && messages.length > 0
                      ? [
                          ...chatMessages,
                          {
                            sender: 'bot',
                            message: messages
                              .map(item => item.message)
                              .join(''),
                            chatId: chat_id,
                            sourceData: sourceData,
                            citations: citationsData,
                            responseTime: responseTime,
                            createdTime: new Date().toLocaleString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            }),
                            retried: retried,
                            // Don't include retriedAnswers during streaming to prevent duplication
                            retriedAnswers: undefined
                          }
                        ]
                      : chatMessages
                  }
                  isShared={false}
                  session={session}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  animation={animation}
                  setInput={setInput}
                  ragStreaming={ragStreaming}
                  handleRetry={handleRetry}
                  isNewMessage={isNewMessage}
                />
              </div>
            </div>
          </div>
        ) : null}

        {chatMessages.length ? (
          <div className="w-full bg-white backdrop-blur supports-[backdrop-filter]:bg-white transition-all duration-300 ease-in-out fixed md:relative bottom-0 left-0 right-0 z-50">
            <ChatPanel
              id={id}
              input={input}
              setInput={setInput}
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
              scrollToTop={scrollToTop}
              onSubmit={handleSend}
              isStreaming={isStreaming}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-4 sm:py-6 px-2 sm:px-4 lg:px-6 pt-[100px] md:pt-4">
            <div className="flex flex-col items-center justify-center h-full pb-4">
              {session && <EmptyScreen session={session} />}
            </div>
            <div className="w-full max-w-4xl">
              <ChatPanel
                id={id}
                input={input}
                setInput={setInput}
                isAtBottom={isAtBottom}
                scrollToBottom={scrollToBottom}
                scrollToTop={scrollToTop}
                onSubmit={handleSend}
                isStreaming={isStreaming}
              />
            </div>
          </div>
        )}

        {isBtnClicked && (
          <div className="fixed top-20 right-2 left-2 md:right-4 md:left-auto z-50 transition-opacity duration-700 ease-in-out max-h-[calc(100vh-6rem)] w-auto max-w-[calc(100%-1rem)] md:max-w-md overflow-auto">
            <div className="opacity-100">
              <Annotations
                setIsAnnotationsClicked={setIsBtnClicked}
                data={annotations}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
