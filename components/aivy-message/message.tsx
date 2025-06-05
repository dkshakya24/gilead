'use client'

import { cn, SUGGESTION_API } from '@/lib/utils'
import logoicon from '@/public/GileadLogo.svg'
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
import { Calendar, GroupIcon, Pin, TicketsPlaneIcon, User } from 'lucide-react'

interface UserMessageProps {
  children: string
}

export const UserMessage: React.FC<UserMessageProps> = ({ children }) => {
  return (
    <div
      className="group relative flex items-start md:-ml-10"
      role="article"
      aria-label="User Message"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm`}
      >
        <FaUserMd className="text-secondary" aria-hidden="true" />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-gray-600">
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  children,
  chatId,
  className,
  isStreaming,
  sourceData,
  citations,
  session,
  setInput
}: {
  children: string
  className?: string
  chatId?: string
  isStreaming?: boolean
  sourceData?: any
  session?: any
  citations?: any
  setInput?: (msg: string) => void
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
  const handleMouseUpEvent = (event: MouseEvent) => {
    const selection = window.getSelection()
    if (!selection) {
      setTooltipVisible(false)
      return
    }

    const { anchorNode, rangeCount } = selection
    if (!rangeCount || !selection.toString()) {
      setTooltipVisible(false)
      return
    }
    if (!anchorNode || !messageRef.current?.contains(anchorNode)) {
      setTooltipVisible(false)
      console.info('Anchor node is null or not in messageRef')
      return
    }

    const ranges = []
    for (let i = 0; i < rangeCount; i++) {
      ranges.push(selection.getRangeAt(i))
    }

    const selectedText = selection?.toString()
    setSelectedText(selectedText)

    const mouseX = event.clientX
    const mouseY = event.clientY
    setTooltipPosition({ top: mouseY - 70, left: mouseX })
    setTooltipVisible(true)
  }

  const revertSelection = (span: HTMLSpanElement, originalText: string) => {
    const parent = span.parentNode
    parent?.insertBefore(document.createTextNode(originalText), span)
    parent?.removeChild(span)
  }
  // const getPromptMessages = async () => {
  //   try {
  //     const response = await fetch(`${SUGGESTION_API}`, {
  //       method: 'GET'
  //     })
  //     const data = await response.json()
  //     if (response.ok) {
  //       setLoading(false)
  //     }
  //     if (data) {
  //       setPromptMessages(data?.frequent_questions)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching prompt messages:', error)
  //   }
  // }

  const getPromptMessages = async (currentChatId: string) => {
    try {
      const response = await fetch(`${SUGGESTION_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatterid: currentChatId,
          user_id: session.user.email || ''
        }) // Assuming `chatId` needs to be sent in the body
      })
      const data = await response.json()
      if (response.ok) {
        setLoading(false)
      }
      // Extract only the suggested questions
      if (data) {
        const messages = data?.slice(0) // Exclude the first sentence
        setPromptMessages(messages)
      }
    } catch (error) {
      console.error('Error fetching prompt messages:', error)
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUpEvent)
    return () => {
      document.removeEventListener('mouseup', handleMouseUpEvent)
    }
  }, [])
  useEffect(() => {
    if (!isStreaming && chatId && currentChatId) {
      // Set chat as ended
      // getPromptMessages()
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

  return (
    <div
      className={cn(
        'group relative flex items-start md:-ml-10 transition-all duration-300 ease-in-out',
        className
      )}
    >
      <div className="hidden md:flex size-[40px] shrink-0 select-none items-center justify-center rounded-full p-2 border bg-white text-primary-foreground shadow-sm">
        <Image src={logoicon} alt="icon" />
      </div>
      <div
        ref={messageRef}
        className="relative ml-0 md:ml-4 flex-1 space-y-2 overflow-hidden px-0 md:px-1 group/item transition-all duration-300 ease-in-out"
      >
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-gray-600"
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw as any, rehypeSanitize]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            h1({ children }) {
              return <h1 className="text-xl">{children}</h1>
            },
            // code({ node, inline, className, children, ...props }) {
            //   if (children.length) {
            //     if (children[0] == '▍') {
            //       return (
            //         <span className="mt-1 animate-pulse cursor-default">▍</span>
            //       )
            //     }

            //     children[0] = (children[0] as string).replace('`▍`', '▍')
            //   }

            //   const match = /language-(\w+)/.exec(className || '')

            //   if (inline) {
            //     return (
            //       <code className={className} {...props}>
            //         {children}
            //       </code>
            //     )
            //   }

            //   return (
            //     <CodeBlock
            //       key={Math.random()}
            //       language={(match && match[1]) || ''}
            //       value={String(children).replace(/\n$/, '')}
            //       {...props}
            //     />
            //   )
            // },
            a({ children, href, ...props }) {
              return (
                <a
                  className={
                    href?.includes('#')
                      ? 'text-xs inline-flex hover:text-white bg-gray-100 rounded-full justify-center items-center underline-none p-1 hover:bg-primary hover:opacity-1 mr-1'
                      : 'text-xs inline-flex  justify-center items-center underline-none text-secondary font-bold'
                  }
                  onClick={() => {
                    // console.log('source clicked')
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
          {children}
        </MemoizedReactMarkdown>

        {/* Tooltip */}
        {tooltipVisible && (
          <div
            // ref={tooltipRef}
            className="fixed text-white p-2 rounded right-4 bottom-1/2"
            style={{
              top: tooltipPosition.top,
              // left: tooltipPosition.left
              // transform: 'translateX(0%)'
              // top: 300,
              left: tooltipPosition.left
            }}
          >
            <Button onClick={handleFeedbackClick}>
              {' '}
              <RiFeedbackLine className="tex-sm w-4 h-4 text-white mr-2" />
              Give Feedback
            </Button>
          </div>
        )}

        {/* sources section */}
        <div className="">
          <div className="flex items-center space-x-2">
            {!isStreaming && citations?.length > 0 ? (
              <SourcesDrawer sourceCall={handleSource}>
                <h1 className="pt-3 px-12 text-primary text-center font-bold text-xl underline underline-offset-8">
                  Citations
                </h1>
                {sourceLoading ? (
                  <div className="animate-pulse space-y-4 px-4 pt-10">
                    {[...Array(10)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 w-full max-w-md"
                      >
                        <div className="bg-gray-300 rounded-full h-6 w-6" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4" />
                          <div className="h-4 bg-gray-300 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 md:p-3 md:px-10 pt-0 flex flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                      <div className="w-full">
                        <ol>
                          {citations.map((item: any) => (
                            <li
                              key={item.source_id}
                              className="border-gray-200 border-b-2 border p-2 md:p-4 mb-2 rounded-sm"
                            >
                              <div className="flex flex-col gap-2 px-1 md:px-2 justify-center w-full pb-2 md:pb-3">
                                <div className="flex flex-row md:flex-row gap-2 justify-between">
                                  <p className="text-xs md:text-sm text-primary text-white text-center bg-secondary rounded-sm p-1 max-w-[200px]">
                                    Citation ID: {item.source_id}
                                  </p>
                                  <a
                                    href={item.img_url}
                                    download={item.doc_name}
                                    className="flex items-center text-xs md:text-sm text-white bg-secondary rounded-sm px-2"
                                  >
                                    <BsDownload className="text-lg md:text-xl text-white" />
                                  </a>
                                </div>
                                <h2 className="text-xs md:text-sm flex gap-2 text-primary">
                                  <i>
                                    <b> Abstract Title -</b> {item.Title}
                                  </i>
                                </h2>
                                <h2 className="text-xs md:text-sm flex flex-row justify-start gap-3 py-2">
                                  {/* <span className="flex flex-row gap-2 items-center">
                                    {' '}
                                    <Calendar className="text-sm md:text-md text-primary" />
                                    <i>{item.Date}</i>
                                  </span>
                                  <span className="flex flex-row gap-2 items-center">
                                    {' '}
                                    <Pin className="text-sm md:text-md text-primary" />
                                    <i>{item.Place}</i>
                                  </span> */}
                                  <span className="flex flex-row gap-2 items-center text-gray-600">
                                    <i>
                                      <b> Presented By -</b>
                                    </i>
                                    <FaUserGroup className="text-sm text-primary" />
                                    <i className="max-w-[300px] truncate">
                                      {item.Presented_by}
                                    </i>
                                  </span>
                                  {/* <q>
                                    {' '}
                                    <i>{item.quote}</i>
                                  </q> */}
                                </h2>
                              </div>
                              <div className="w-full flex flex-col">
                                <div className="relative group mb-2 w-full h-[30vh] md:h-screen md:max-h-[50vh]">
                                  <div>
                                    <Image
                                      className="w-full rounded-md border-gray shadow-md"
                                      src={item.img_url}
                                      alt={item.img_url}
                                      layout="fill"
                                      objectFit="contain"
                                    />
                                    <MdFullscreen
                                      className="absolute top-2 bg-primary right-2 text-white block md:group-hover:block md:hidden rounded-full w-[30px] h-[30px] md:w-[35px] md:h-[35px] p-2"
                                      onClick={() => {
                                        setSelectedImage(item.img_url)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-full flex flex-row md:flex-row gap-2 justify-between items-start md:items-center py-1 md:py-2">
                                  <p className="text-xs md:text-sm flex gap-2 break-all">
                                    <GrDocumentImage className="text-lg md:text-xl text-primary flex-shrink-0" />
                                    {item.doc_name}
                                  </p>
                                  <p className="text-xs md:text-sm text-primary text-white text-center bg-secondary rounded-sm px-2 py-1">
                                    {item.page_num}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        {selectedImage && (
                          <div className="fixed inset-0 top-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-4">
                            <div
                              ref={citationModalRef}
                              className="w-full md:max-w-[58%] flex flex-col relative bg-white rounded-md p-2 md:p-4 box-border overflow-y-auto h-[95vh] md:h-auto md:max-h-[95vh]"
                            >
                              <button
                                className="absolute top-2 right-2 z-10 flex items-center justify-center"
                                onClick={() => setSelectedImage(null)}
                              >
                                <MdOutlineCloseFullscreen className="bg-primary text-white rounded-full p-1 w-8 h-8 md:w-10 md:h-10 transition-transform hover:scale-110" />
                              </button>
                              <div className="w-full h-full flex items-center justify-center">
                                <Image
                                  className="w-full h-auto max-h-[85vh] object-contain object-center border border-gray-200 rounded-sm"
                                  src={selectedImage}
                                  alt="Citation image"
                                  width={800}
                                  height={800}
                                  priority
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SourcesDrawer>
            ) : null}
          </div>
        </div>
        {isCitationModalClicked ? (
          <>
            <CitationComponent
              hrefValue={href}
              citations={citations}
              setIsCitationModalClicked={setIsCitationModalClicked}
            />
          </>
        ) : null}
        {/* {!isStreaming && chatId ? (
          <div className="mt-4 hidden md:block">
            <Separator className="my-4" />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <p className="text-sm font-medium text-gray-600">
                You may want to ask
              </p>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-12 rounded-lg shrink-0 animate-pulse bg-zinc-100 dark:bg-zinc-800"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {promptMessages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => handleMessageClick(message)}
                    className="group relative px-4 py-3 border border-gray-200 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out bg-white hover:bg-gray-50 hover:border-secondary/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                          {message}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-200">
                          <FaArrowRightLong
                            size={14}
                            className="text-secondary group-hover:translate-x-0.5 transition-transform duration-200"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-secondary/0 group-hover:ring-secondary/20 transition-all duration-200"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null} */}
        {isFeedbackClicked ? (
          <FeedbackComponent
            setIsFeedbackClicked={setIsFeedbackClicked}
            chatId={chatId}
            selectedText={selectedText}
            startOffset={startOffset}
            endOffset={endOffset}
            session={session}
            selectSpanElement={selectSpanElement}
            revertSelection={revertSelection}
          />
        ) : null}
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
    <div className="group relative flex items-center md:-ml-12">
      <div className="flex size-[40px] shrink-0 select-none items-center justify-center rounded-full p-2 border bg-white text-primary-foreground shadow-sm">
        <Image src={logoicon} alt="icon" />
      </div>
      <div className="ml-4 flex-1 flex items-center gap-2 overflow-hidden px-1 group/item">
        <p className="mt-0 text-secondary animate-pulse">
          AI Assistant is generating insights
        </p>{' '}
        {spinner}{' '}
      </div>
    </div>
  )
}
export function MessageLoader2() {
  return (
    <div className="group absolute top-10px flex items-center md:-ml-12">
      <div className="flex size-[40px] shrink-0 select-none items-center justify-center rounded-full p-2 border bg-white text-primary-foreground shadow-sm">
        <Image src={logoicon} alt="icon" />
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
