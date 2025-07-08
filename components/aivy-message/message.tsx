'use client'

import { cn, SUGGESTION_API } from '@/lib/utils'
import logoicon from '@/public/GileadLogo.svg'
import logoicon1 from '@/public/GL.svg'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { BsChatQuote, BsDownload } from 'react-icons/bs'
import { FaUserMd } from 'react-icons/fa'
import { GrDocumentImage } from 'react-icons/gr'
import { MdFullscreen, MdOutlineCloseFullscreen } from 'react-icons/md'
import { RiFeedbackLine } from 'react-icons/ri'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MemoizedReactMarkdown } from '../markdown'
import { SourcesDrawer } from '../sources-drawer'
import { Button } from '../ui/button'
// import { CodeBlock } from '../ui/codeblock'
import CitationComponent from './citation-data'
import FeedbackComponent from './feedback'
import { spinner } from './spinner'
import { Separator } from '../ui/separator'
import { FaArrowRightLong, FaUserGroup } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  GroupIcon,
  Pin,
  TicketsPlaneIcon,
  User,
  Volume1Icon,
  VolumeOffIcon
} from 'lucide-react'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import {
  IconCopy,
  IconCheck,
  IconDownload,
  IconSpeaker,
  IconSpeakerStop,
  IconMail,
  IconRefresh,
  IconClose
} from '../ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useWebSocketStore } from '@/lib/store/websocket-store'
import { SourcesPanel } from '@/components/gilead/sources-panel'
import { Link2, ExternalLink } from 'lucide-react'

interface UserMessageProps {
  children: string
  createdTime?: string
  isRetried?: boolean
  retryReason?: string
  isLastMessage?: boolean
  isStreaming?: boolean
}

export const UserMessage: React.FC<UserMessageProps> = ({
  children,
  createdTime,
  isRetried = false,
  retryReason,
  isLastMessage = false,
  isStreaming = false
}) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-end items-end w-full',
        !isStreaming && isLastMessage && 'pr-[280px]'
      )}
      role="article"
      aria-label="User Message"
    >
      <div className="flex gap-x-2 items-center mb-2">
        <span className="text-xs text-gray-500">{createdTime}</span>
        {isRetried && (
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            Retried
          </span>
        )}
      </div>
      <div className="rounded-2xl px-5 py-3 gap-y-[6px] bg-[#DAE1E7] text-[#323F49] rounded-tr-none">
        <div className="text-[#4A5E6D] text-sm leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </div>
  )
}

export function BotMessage({
  children,
  chatId,
  createdTime,
  className,
  isStreaming,
  sourceData,
  citations,
  session,
  setInput,
  responseTime,
  isLastMessage,
  isRetried = false,
  onRetry,
  retryReason,
  retried = false,
  retriedAnswers = []
}: {
  children: string
  className?: string
  chatId?: string
  isStreaming?: boolean
  sourceData?: any
  session?: any
  citations?: any
  createdTime?: any
  setInput?: (msg: string) => void
  responseTime?: string
  isLastMessage?: boolean
  isRetried?: boolean
  onRetry?: (reason: string) => void
  retryReason?: string
  retried?: boolean
  retriedAnswers?:
    | Array<{ retry_reason: string; answer: string; responseTime?: string }>
    | string[]
}) {
  const [sourceLoading, setSourceLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isFeedbackClicked, setIsFeedbackClicked] = useState(false)
  const [isCitationModalClicked, setIsCitationModalClicked] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const citationModalRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState('')
  const [startOffset, setStartOffset] = useState(0)
  const [endOffset, setEndOffset] = useState(2)
  const [href, setHref] = useState('')
  const [selectSpanElement, setSelectSpanElement] =
    useState<HTMLSpanElement | null>(null)
  const [selectionSelected, setSelectionSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [promptMessages, setPromptMessages] = useState<string[]>([])
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const pathname = usePathname()
  const currentChatId = pathname.split('/').pop()
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [retryReasonInput, setRetryReasonInput] = useState('')
  const [showRetryInput, setShowRetryInput] = useState(false)
  const { isSuggestions } = useWebSocketStore()
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0)
  const [showAllSources, setShowAllSources] = useState(false)

  // Function to extract unique URLs from message content
  const extractUrlsFromMessage = (message: string) => {
    // Regular expression to match both markdown links and plain URLs
    const markdownPattern = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g
    const urlPattern = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
    const urlMap = new Map<
      string,
      { url: string; title: string; description: string }
    >()

    try {
      // Extract markdown links
      let match
      while ((match = markdownPattern.exec(message)) !== null) {
        const url = match[2]
        if (!urlMap.has(url)) {
          urlMap.set(url, {
            url,
            title: match[1],
            description: `Referenced link from the conversation`
          })
        }
      }

      // Extract plain URLs
      while ((match = urlPattern.exec(message)) !== null) {
        const url = match[1]
        if (!urlMap.has(url)) {
          // Try to extract a title from the URL
          const urlObj = new URL(url)
          const pathSegments = urlObj.pathname.split('/').filter(Boolean)
          const title =
            pathSegments[pathSegments.length - 1]
              ?.replace(/-/g, ' ')
              ?.replace(/\.[^/.]+$/, '')
              ?.split(' ')
              ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
              ?.join(' ') || 'Referenced Link'

          urlMap.set(url, {
            url,
            title,
            description: `Referenced from ${urlObj.hostname}`
          })
        }
      }
    } catch (error) {
      console.error('Error extracting URLs:', error)
    }

    return Array.from(urlMap.values())
  }

  // Always extract URLs from message content
  const extractedUrls = extractUrlsFromMessage(children)
  const sources = extractedUrls
  const hasMoreSources = sources.length > 3
  const displayedSources = hasMoreSources ? sources.slice(0, 3) : sources

  useEffect(() => {
    console.log('Message content:', children)
    console.log('Extracted URLs:', extractedUrls)
  }, [children])

  const handleMouseUpEvent = (event: any) => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setTooltipVisible(false)
      return
    }

    const selectedText = selection.toString().trim()
    if (!selectedText) {
      setTooltipVisible(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setSelectedText(selectedText)
    setStartOffset(range.startOffset)
    setEndOffset(range.endOffset)

    // Calculate tooltip position
    const tooltipTop = rect.top - 40 // 40px above the selection
    const tooltipLeft = rect.left + rect.width / 2 // Centered horizontally

    setTooltipPosition({ top: tooltipTop, left: tooltipLeft })
    setTooltipVisible(true)

    // Store selection details for feedback
    setSelectionSelected({
      selectedText,
      selectedSpans: Array.from(
        selection.getRangeAt(0).cloneContents().childNodes
      )
        .map(node => node.textContent)
        .filter(Boolean),
      ranges: {
        start: range.startOffset,
        end: range.endOffset
      }
    })
  }

  const revertSelection = (span: HTMLSpanElement, originalText: string) => {
    const parent = span.parentNode
    parent?.insertBefore(document.createTextNode(originalText), span)
    parent?.removeChild(span)
  }

  const getPromptMessages = async (currentChatId: string) => {
    try {
      if (!SUGGESTION_API) {
        console.error('SUGGESTION_API is not configured')
        return
      }

      console.log('Fetching from:', SUGGESTION_API)
      const response = await fetch(`${SUGGESTION_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: currentChatId,
          user_id: session?.user?.email || ''
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        return
      }

      const data = await response.json()
      if (response.ok) {
        setLoading(false)
      }

      if (data) {
        const messages = data?.slice(0)
        setPromptMessages(messages)
      }
    } catch (error) {
      console.error('Error fetching prompt messages:', error)
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON response from server')
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUpEvent)
    return () => {
      document.removeEventListener('mouseup', handleMouseUpEvent)
    }
  }, [])
  useEffect(() => {
    if (!isStreaming && chatId && currentChatId && isSuggestions) {
      setTimeout(() => {
        getPromptMessages(currentChatId)
      }, 2000)
    }
  }, [chatId])
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        citationModalRef.current &&
        !citationModalRef.current.contains(event.target)
      ) {
        setSelectedImage(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCitationModalClicked])

  const handleFeedbackClick = () => {
    const selection = window.getSelection()
    if (!selection) {
      console.log('Selection is null')
      return
    }

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    setTooltipVisible(false)
    setIsFeedbackClicked(true)

    // Create a span element to wrap the selected text
    const span = document.createElement('span')
    span.style.backgroundColor = '#c98b26'
    span.style.color = 'white'

    // Extract the selected text nodes
    const textNodes = getTextNodesInRange(range)

    // Wrap each text node in the span
    textNodes.forEach(node => {
      const nodeRange = document.createRange()
      nodeRange.selectNodeContents(node)
      nodeRange.surroundContents(span.cloneNode(true))
    })

    // Store the selection and span for feedback submission
    setSelectionSelected({
      selectedText,
      selectedSpan: span,
      range
    })
  }
  // Function to get all text nodes within a range
  const getTextNodesInRange = (range: Range) => {
    const startContainer = range.startContainer
    const endContainer = range.endContainer
    const commonAncestor = range.commonAncestorContainer

    const textNodes = []
    const iterator = document.createNodeIterator(
      commonAncestor,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: node => {
          const nodeRange = document.createRange()
          nodeRange.selectNodeContents(node)
          return range.compareBoundaryPoints(Range.START_TO_END, nodeRange) ===
            1 &&
            range.compareBoundaryPoints(Range.END_TO_START, nodeRange) === -1
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT
        }
      }
    )

    let currentNode
    while ((currentNode = iterator.nextNode())) {
      textNodes.push(currentNode)
    }

    return textNodes
  }
  const handleMessageClick = (message: string) => {
    setSelectedMessage(message) // Store the selected message
    if (setInput) {
      setInput(message)
    }
    console.log('Selected message:', message) // Perform any action (logging here)
  }
  const handleSource = async () => {
    if (citations && citations.length > 0) {
      // setSourceInfo(sourceData)
      setSourceLoading(false)
    }
  }

  const submitFeedback = () => {
    if (!selectionSelected) {
      console.log('Nothing is selected for feedback')
      return
    }

    const { selectedText, selectedSpans, ranges } = selectionSelected

    // Your feedback submission logic here
    console.log('Submitting feedback for:', selectedText, ranges)
  }

  // Download handler for .txt file
  const handleDownload = () => {
    if (messageRef.current) {
      const formattedText = messageRef.current.innerText
      const blob = new Blob([formattedText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gilead-response-${chatId || 'message'}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 2000)
    }
  }

  // Text-to-Speech handler
  const handleSpeak = () => {
    if (messageRef.current) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new window.SpeechSynthesisUtterance(
          messageRef.current.innerText
        )
        utterance.lang = 'en-US'

        // Add all speech event handlers
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        utterance.onpause = () => setIsSpeaking(false)
        utterance.onresume = () => setIsSpeaking(true)

        // Cancel any existing speech first
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  // Cancel speech and reset state when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Function to handle answer switching
  const handleAnswerSwitch = (index: number) => {
    setSelectedAnswerIndex(index)
  }

  // Get the current answer content based on selected index
  const getCurrentAnswerContent = () => {
    if (retried && retriedAnswers && retriedAnswers.length > 0) {
      if (selectedAnswerIndex === 0) {
        return children // Current answer
      } else {
        const retriedAnswer = retriedAnswers[selectedAnswerIndex - 1]
        // Handle both object and string formats
        if (typeof retriedAnswer === 'object' && retriedAnswer.answer) {
          return retriedAnswer.answer
        } else if (typeof retriedAnswer === 'string') {
          return retriedAnswer
        }
        return children
      }
    }
    return children
  }

  // Get retry reason for the selected answer
  const getRetryReason = () => {
    if (
      retried &&
      retriedAnswers &&
      retriedAnswers.length > 0 &&
      selectedAnswerIndex > 0
    ) {
      const retriedAnswer = retriedAnswers[selectedAnswerIndex - 1]
      if (typeof retriedAnswer === 'object' && retriedAnswer.retry_reason) {
        return retriedAnswer.retry_reason
      }
    }
    return null
  }

  // Get response time for the selected answer
  const getCurrentResponseTime = () => {
    if (retried && retriedAnswers && retriedAnswers.length > 0) {
      if (selectedAnswerIndex === 0) {
        return responseTime // Current answer response time
      } else {
        const retriedAnswer = retriedAnswers[selectedAnswerIndex - 1]
        // Handle both object and string formats
        if (typeof retriedAnswer === 'object' && retriedAnswer.responseTime) {
          return retriedAnswer.responseTime
        }
        // If no responseTime in retried answer, fall back to current responseTime
        return responseTime
      }
    }
    return responseTime
  }
  // Add email handler function
  const handleEmail = () => {
    if (messageRef.current) {
      try {
        // Get the message content
        const messageContent = messageRef.current.innerText

        // Format the content with some context
        const formattedContent = `
GABI ARC Chat Response

${messageContent}

Response Time: ${responseTime || 'N/A'}
Generated: ${createdTime || 'N/A'}
        `.trim()

        // Properly encode the subject and body for mailto
        const subject = encodeURIComponent('GABI ARC')
        const body = encodeURIComponent(formattedContent)

        // Construct and open the mailto link
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`
        window.open(mailtoLink, '_blank')
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }
  }

  return (
    <div
      className="group relative flex flex-col w-full max-w-[100vw]"
      role="article"
      aria-label="Assistant Message"
    >
      {/* Feedback tooltip */}
      {tooltipVisible && (
        <div
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000
          }}
          className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2"
        >
          <button
            onClick={() => {
              setIsFeedbackClicked(true)
              setTooltipVisible(false)
            }}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <RiFeedbackLine className="w-4 h-4" />
            Give Feedback
          </button>
        </div>
      )}

      {/* Feedback form */}
      {isFeedbackClicked && (
        <FeedbackComponent
          setIsFeedbackClicked={setIsFeedbackClicked}
          selectedText={selectedText}
          chatId={chatId}
          session={session}
          startOffset={startOffset}
          endOffset={endOffset}
          selectSpanElement={selectSpanElement}
          revertSelection={(span, originalText) => {
            if (span) {
              span.textContent = originalText
            }
          }}
        />
      )}

      <div
        className={cn(
          'flex flex-col w-full max-w-screen-2xl mx-auto px-4',
          !isStreaming && 'pr-[280px]'
        )}
      >
        <div className="flex items-start">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
            <Image
              src={logoicon}
              alt="Gilead Logo"
              width={20}
              height={20}
              className="rounded"
            />
          </div>

          <div className="flex-1 ml-4 min-w-0">
            <div className="flex gap-x-2 justify-between items-center mb-2">
              <div className="flex items-center gap-x-2">
                <span className="text-xs text-gray-500">{createdTime}</span>
                {responseTime && (
                  <div className="text-xs text-gray-500 ml-2">
                    Response Time:{' '}
                    {getCurrentResponseTime()
                      ? `${getCurrentResponseTime()}`
                      : 'Calculating...'}
                  </div>
                )}
              </div>
              {retried && retriedAnswers && retriedAnswers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Versions:</span>
                  <div className="flex gap-1">
                    {/* Current Answer Button */}
                    <button
                      onClick={() => handleAnswerSwitch(0)}
                      className={cn(
                        'w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center',
                        selectedAnswerIndex === 0
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                      title="Current Answer"
                    >
                      C
                    </button>

                    {/* Retried Answers Buttons */}
                    {retriedAnswers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSwitch(index + 1)}
                        className={cn(
                          'w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center',
                          selectedAnswerIndex === index + 1
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                        title={`Previous Answer ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isRetried && (
                <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                  Retried
                </span>
              )}
            </div>

            <div className="flex gap-4 relative">
              <div
                className={cn(
                  'flex-1 min-w-0 rounded-2xl px-5 py-3 gap-y-[6px] bg-[#F5F7F9] text-[#323F49] rounded-tl-none',
                  className
                )}
              >
                {/* Answer Version Indicator */}
                {retried && retriedAnswers && retriedAnswers.length > 0 && (
                  <div className="mb-3">
                    {/* <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  selectedAnswerIndex === 0 ? 'bg-secondary' : 'bg-orange-500'
                )}
              ></div>
              <p className="text-sm font-medium text-gray-700">
                {selectedAnswerIndex === 0
                  ? 'Current Answer'
                  : `Previous Answer ${selectedAnswerIndex}`}
              </p>
            </div> */}

                    {/* Retry Reason Display */}
                    {getRetryReason() && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-xs font-medium text-orange-800 mb-1">
                              Retry Reason:
                            </p>
                            <p className="text-xs text-orange-700 italic">
                              {getRetryReason()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div
                  ref={messageRef}
                  className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                >
                  <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw as any, rehypeSanitize]}
                    components={{
                      p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>
                      },
                      h1({ children }) {
                        return (
                          <h1 className="text-xl my-2 mt-[10px]">{children}</h1>
                        )
                      },
                      h2({ children }) {
                        return (
                          <h2 className="text-lg my-2 mt-[10px]">{children}</h2>
                        )
                      },
                      h3({ children }) {
                        return (
                          <h3 className="text-base my-2 mt-[10px]">
                            {children}
                          </h3>
                        )
                      },
                      ul({ children }) {
                        return (
                          <ul className="list-disc pl-4 my-2">{children}</ul>
                        )
                      },
                      ol({ children }) {
                        return (
                          <ol className="list-decimal pl-4 my-2">{children}</ol>
                        )
                      },
                      li({ children }) {
                        return <li className="mb-1">{children}</li>
                      },
                      a({ children, href, ...props }) {
                        return (
                          <a
                            className={
                              href?.includes('#')
                                ? 'text-xs inline-flex hover:text-white bg-gray-100 rounded-full justify-center items-center underline-none p-1 hover:bg-primary hover:opacity-1 mr-1'
                                : 'text-xs inline-flex  justify-center items-center underline-none text-secondary font-bold'
                            }
                            onClick={() => {
                              if (href) setHref(href)
                              if (href?.includes('#')) {
                                setIsCitationModalClicked(true)
                              }
                            }}
                            href={href}
                            target={href?.includes('#') ? '' : '_blank'}
                            {...props}
                          >
                            {children}
                          </a>
                        )
                      },
                      table({ children }) {
                        return (
                          <div className="my-4 overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg">
                              {children}
                            </table>
                          </div>
                        )
                      },
                      thead({ children }) {
                        return <thead className="bg-gray-50">{children}</thead>
                      },
                      th({ children }) {
                        return (
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-300">
                            {children}
                          </th>
                        )
                      },
                      td({ children }) {
                        return (
                          <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-200 whitespace-normal">
                            {children}
                          </td>
                        )
                      },
                      tr({ children }) {
                        return (
                          <tr className="hover:bg-gray-50 transition-colors">
                            {children}
                          </tr>
                        )
                      }
                    }}
                  >
                    {getCurrentAnswerContent()}
                  </MemoizedReactMarkdown>
                </div>

                {/* Message actions */}
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(children)}
                  >
                    {isCopied ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <IconCopy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy message</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleDownload}
                    disabled={isDownloaded}
                  >
                    {isDownloaded ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <IconDownload className="h-4 w-4" />
                    )}
                    <span className="sr-only">Download</span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleEmail}
                      >
                        <IconMail className="h-4 w-4" />
                        <span className="sr-only">Email</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send via email</TooltipContent>
                  </Tooltip>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSpeak}
                  >
                    {isSpeaking ? (
                      <VolumeOffIcon className="text-primary h-4 w-4" />
                    ) : (
                      <Volume1Icon className="text-gray-600 h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isSpeaking ? 'Stop speaking' : 'Speak message'}
                    </span>
                  </Button>

                  {onRetry && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowRetryInput(true)}
                    >
                      <IconRefresh className="h-4 w-4" />
                      <span className="sr-only">Retry</span>
                    </Button>
                  )}
                </div>

                {/* Sources panel */}
                {sources.length > 0 && (
                  <div className="w-[280px] flex-shrink-0 absolute right-[-300px] top-0">
                    <div className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link2 className="h-4 w-4" />
                          <span>Referenced Links ({sources.length})</span>
                        </div>
                        {hasMoreSources && (
                          <button
                            onClick={() => setShowAllSources(prev => !prev)}
                            className="text-xs text-primary hover:text-primary/80"
                          >
                            {showAllSources
                              ? 'Show Less'
                              : `Show All (${sources.length})`}
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(showAllSources ? sources : displayedSources).map(
                          (source, index) => (
                            <div
                              key={`${source.url}-${index}`}
                              className="rounded-lg border bg-card p-2 hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1 flex-1">
                                  <h3 className="font-medium text-sm line-clamp-1">
                                    {source.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {source.description}
                                  </p>
                                </div>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Retry input */}
        {showRetryInput && onRetry && (
          <div className="mt-4 max-w-2xl">
            <input
              type="text"
              value={retryReasonInput}
              onChange={e => setRetryReasonInput(e.target.value)}
              placeholder="Enter reason for retry..."
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => {
                  onRetry(retryReasonInput)
                  setShowRetryInput(false)
                  setRetryReasonInput('')
                }}
              >
                Submit
              </Button>
              <Button variant="ghost" onClick={() => setShowRetryInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {isLastMessage && !isStreaming && promptMessages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Suggested Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {promptMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(message)}
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-10">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-white text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <Image src={logoicon} alt="icon" />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-center md:-ml-1 mt-3">
      <div className="flex size-[40px] shrink-0 select-none items-center justify-center rounded-full p-2 border bg-white text-primary-foreground shadow-sm">
        <Image src={logoicon1} alt="icon" />
      </div>
      <div className="ml-4 flex-1 flex items-center gap-2 overflow-hidden px-1 group/item">
        <p className="mt-0 text-secondary animate-pulse">
          Auto Research & Comprehension Engine at work — please wait
        </p>{' '}
        {spinner}{' '}
      </div>
    </div>
  )
}
export function MessageLoader2() {
  return (
    <div className="group absolute top-10px flex items-center md:-ml-10">
      <div className="flex size-[40px] shrink-0 select-none items-center justify-center rounded-full p-2 border bg-white text-primary-foreground shadow-sm">
        <Image src={logoicon1} alt="icon" />
      </div>
      <div className="ml-4 flex-1 flex items-center gap-2 overflow-hidden px-1 group/item">
        <p className="mt-0 text-secondary animate-pulse">
          Analyzing citations{' '}
        </p>
        {spinner}
      </div>
    </div>
  )
}
