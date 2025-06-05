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
import { notFound, redirect } from 'next/navigation'
import useWebSocket from '@/lib/hooks/useWebSocket'
import Annotations from './aivy-message/annotations'
import { MdOutlineInsertComment } from 'react-icons/md'
import { Button } from './ui/button'
import SourceMultiSelect from './source-multi-select'
import { DownloadChat } from './ui/chatdownload-button'
import ExternalDataFlag from '@/components/aivy-message/external-data-flag'
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
  sourceData?: any
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
  const [suggestionQuestions, setSuggestionQuestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [info, setInfo] = useState<string>('')
  const [eveningInsight, setInsight] = useState(false)
  console.log(dataKey, 'dataKey')

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
    if (initialMessages?.length > 0) {
      const history: ChatMessage[] = []

      initialMessages?.forEach((item: any) => {
        history.push({ sender: 'user', message: item.question })
        history.push({
          sender: 'receiver',
          message: item.answer,
          chatId: item.Session_id,
          sourceData: item.sources_list,
          citations: item.specific_citations
        })
      })
      if (initialMessages?.length > 0 && initialMessages[0].Data) {
        setDataKey(initialMessages[0].Data)
      }
      setChatMessages([...chatMessages, ...history])
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
    const payload = {
      headers: {
        'User-Id': session?.user.email
      },
      body: {}
    }
    if (path === '/aivy') {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${API_URL}/${PROJECT_NAME}_addchatbox`,
            {
              method: 'POST',
              body: JSON.stringify(payload)
            }
          )
          const data = await response.json()
          setNewchatboxId(data.body.chatter_id)
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
    action: 'websearchagent',
    chatter_id: id ? id : newchatboxId,
    question: input,
    user_id: session?.user.email,
    // externalData: externalDataEnabled,
    data_source: 'esmo',
    evening_insights: false,
    Data: selectedStudies.length > 0 ? selectedStudies : [],
    // Data: [],
    externalData: true,
    agent: agent
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
        window.history.replaceState({}, '', `/aivy/chat/${newchatboxId}`)
      }
    }
  }, [newchatboxId, path, session?.user, chatMessages])

  // useEffect(() => {
  //   const messagesLength = messages?.length
  //   if (messagesLength === 2) {
  //     router.refresh()
  //   }
  // }, [messages, router])

  // useEffect(() => {
  //   setNewChatId(id)
  // })

  const {
    messagesRef,
    scrollRef,
    visibilityRef,
    isAtBottom,
    scrollToBottom,
    scrollToTop
  } = useScrollAnchor()

  return (
    <div className="group w-full overflow-auto pl-0 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className="flex flex-col h-[calc(100vh-4rem)] w-full justify-center md:justify-start">
        {chatMessages.length ? (
          <div className="flex-1 w-full h-full overflow-y-auto">
            <div className="sticky top-0 z-50 left-0 right-0 h-[60px] bg-blue-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60 flex items-center justify-between px-2 sm:px-4 lg:px-6 flex">
              <div className="w-full max-w-auto sm:max-w-none flex gap-4">
                {/* <SourceMultiSelect
                  session={session}
                  setSuggestionQuestions={setSuggestionQuestions}
                  setIsLoadingSuggestions={setIsLoadingSuggestions}
                  dataKey={dataKey}
                /> */}
              </div>
              {chatMessages.length && !isBtnClicked && (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    onClick={handleannotationClicked}
                    className="hover:bg-blue-600 transition-colors p-2 sm:p-3"
                  >
                    <MdOutlineInsertComment className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </Button>
                </div>
              )}
            </div>
            <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 pb-32 md:pb-6">
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
        ) : (
          <div className="absolute md:sticky left-0 top-0 z-50 md:left-auto right-0 py-1 h-[60px] bg-blue-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60 flex items-center justify-start px-2 sm:px-4 lg:px-6 flex">
            <div className="w-full max-w-auto sm:max-w-none flex gap-4">
              {/* <SourceMultiSelect
                session={session}
                setSuggestionQuestions={setSuggestionQuestions}
                setIsLoadingSuggestions={setIsLoadingSuggestions}
                dataKey={dataKey}
              /> */}
              {/* {isUserAllowedForEveningInsights(session?.user.email) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={eveningInsight}
                        onClick={handleEveningInsight}
                        className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                          eveningInsight
                            ? 'bg-primary text-white hover:bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                            : 'bg-secondary text-white hover:bg-secondary hover:shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                        }`}
                      >
                        {eveningInsight && <MdCheck className="w-4 h-4" />}
                        Evening Insights
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="z-100"
                  >
                    {' '}
                    Select this option to ask anything about the Evening
                    Insights.
                  </TooltipContent>
                </Tooltip>
              )} */}
            </div>
          </div>
        )}

        {chatMessages.length ? (
          <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out fixed md:relative bottom-0 left-0 right-0 z-50">
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
