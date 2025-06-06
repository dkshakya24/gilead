'use client'

import { FEEDBACK_API, SUGGESTION_API, WEBSOCKET, cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Session, initialMessage } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { Message, UIState } from '@/lib/chat/actions'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
// import { toast } from 'sonner'
import { API_URL, PROJECT_NAME } from '@/lib/utils'
import useWebSocket from '@/lib/hooks/useWebSocket'
import Annotations from './aivy-message/annotations'
import { MdOutlineInsertComment } from 'react-icons/md'
import { Button } from './ui/button'

import { toast } from 'sonner'
import {
  MdOutlineScience,
  MdOutlineBiotech,
  MdOutlineBusinessCenter,
  MdOutlinePersonSearch,
  MdCheck
} from 'react-icons/md'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: any
  id?: string
  session?: Session
}
export interface ChatMessage {
  sender: string
  message: string
  chatId?: string
  responseTime?: any
  citations?: any
}

export function Chat({ id, className, session, initialMessages }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
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
    ragStreaming
  } = useWebSocket(WEBSOCKET as string)
  const [input, setInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newchatboxId, setNewchatboxId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState<string[]>([])
  const [isBtnClicked, setIsBtnClicked] = useState(false)
  const [annotations, setAnnotations] = useState<any>()
  const [agent, setAgent] = useState<string>('')
  const [autoScrollInterval, setAutoScrollInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [dataKey, setDataKey] = useState<string[]>([])

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
  const [info, setInfo] = useState<string>('')
  const [eveningInsight, setInsight] = useState(false)

  const isUserAllowedForEveningInsights = (email: string | undefined) => {
    if (!email) return false

    const allowedEmails = [
      'melina.heller-false-speiser@merckgroup.com',
      'seval.sonmez@emdserono.com',
      'myriam.hnatkow@merckgroup.com',
      'irana.kolev@emdserono.com',
      'suraj.moorthy@emdserono.com',
      'chetak.buaria@merckgroup.com',
      'kiran-narasimha.rao@external.merckgroup.com',
      'prakash.sm@chryselys.com',
      'jyotsna.mulgund@emdserono.com',
      'deepak.kumar@chryselys.com',
      'ramakrishna.kodam@chryselys.com',
      'subhranjit.sahoo@chryselys.com',
      'renuka.sai@chryselys.com',
      'anirudha.n@chryselys.com',
      'avinash.tiwari@chryselys.com',
      'pavithra.p@chryselys.com'
    ]

    return allowedEmails.includes(email.toLowerCase())
  }

  const handleannotationClicked = () => {
    setIsBtnClicked(true)
    handleAnnotations()
    // Show feedback form logic here
  }
  useEffect(() => {
    if (initialMessages?.messages?.length > 0) {
      const chathistory: ChatMessage[] = []

      initialMessages.messages?.forEach((chat: any) => {
        chat.message.forEach((item: any) => {
          if (item.role === 'user') {
            chathistory.push({
              sender: 'user',
              message: item.content
            })
          } else if (item.role === 'assistant') {
            chathistory.push({
              sender: 'receiver',
              message: item.content,
              chatId: chat.message_id,
              responseTime: item.responseTime
            })
          }
        })
      })

      if (initialMessages?.length > 0 && initialMessages[0].Data) {
        setDataKey(initialMessages[0].Data)
      }
      setChatMessages([...chatMessages, ...chathistory])
      console.log(chathistory, 'chathistory')
    } else if (
      initialMessages?.error ===
      'No documents found for the provided User-Id and chatter_id'
    ) {
      console.log('kasdhasdrouter')
      toast.error('No Chat Found', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    } else if (initialMessages === undefined) {
      console.log('kasdhasdrouter1')
    }
  }, [path])

  useEffect(() => {
    if (path === '/arc') {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/utils/generate-id', {
            method: 'GET'
          })
          const data = await response.json()
          setNewchatboxId(data.id)
          // Further processing of data can be done here
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [])
  const handleEveningInsight = () => {
    const newValue = !eveningInsight
    setInsight(newValue)
    localStorage.setItem('eveningInsight', JSON.stringify(newValue))
  }

  const updateSelectedStudies = () => {
    // localStorage.setItem('studies', JSON.stringify(['UC']))
    const study = localStorage.getItem('studies')
    if (study) {
      const parsedData = JSON.parse(study)
      console.log(Array.isArray(parsedData), 'parsedData')

      if (Array.isArray(parsedData)) {
        setSelectedStudies(parsedData)
      }
    } else {
      // Default to "UC"
      setSelectedStudies([''])
      localStorage.setItem('studies', JSON.stringify(['']))
    }
  }

  useEffect(() => {
    updateSelectedStudies()
    window.addEventListener('storageUpdate', updateSelectedStudies)

    return () => {
      window.removeEventListener('storageUpdate', updateSelectedStudies)
    }
  }, [path, chatMessages, isStreaming, animation, input])

  const payload = {
    action: 'sendmessage',
    sessionId: id ? id : newchatboxId,
    query: input,
    userId: session?.user.email
  }

  const handleSend = () => {
    // if (!message) return
    // setIsLoading(true)
    emptyMessages()
    const userMessage: ChatMessage = { sender: 'user', message: input }
    let userMessages: any = []
    if (messages.length > 0) {
      userMessages = [
        ...chatMessages,
        {
          sender: 'bot',
          message: messages.map(item => item.message).join(''),
          chatId: chat_id,
          sourceData: sourceData,
          citations: citationsData
        },
        userMessage
      ]
    } else {
      userMessages = [...chatMessages, userMessage]
    }
    setChatMessages(userMessages)
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

  return (
    <div className="group w-full overflow-auto pl-0 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[300px] peer-[[data-state=open]]:xl:pl-[340px]">
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full justify-center md:justify-start">
        {chatMessages.length ? (
          <div className="flex-1 w-full h-full overflow-y-auto flex justify-center items-start">
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
                  messages={[
                    ...chatMessages,
                    {
                      sender: 'bot',
                      message: messages.map(item => item.message).join(''),
                      chatId: chat_id,
                      sourceData: sourceData,
                      citations: citationsData
                    }
                  ]}
                  isShared={false}
                  session={session}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  animation={animation}
                  setInput={setInput}
                  ragStreaming={ragStreaming}
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
              <EmptyScreen infoMessage={info} />
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
