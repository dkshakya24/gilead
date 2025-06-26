import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import {
  SpinnerMessage,
  UserMessage,
  BotMessage,
  MessageLoader2
} from '@/components/aivy-message/message'
import { useEffect, useRef } from 'react'

export interface ChatList {
  messages: (UIState[number] & {
    onRetry?: (reason: string) => void
    isRetried?: boolean
    retryReason?: string
  })[]
  session?: Session
  isShared: boolean
  isLoading: boolean
  isStreaming?: boolean
  animation?: boolean
  ragStreaming?: boolean
  setInput?: (msg: string) => void
  handleRetry?: (
    msgIndex: number,
    userMessage: string,
    chatId: string
  ) => (reason: string) => void
  // streamingMessages: { message: string }[]
}

export function ChatList({
  messages,
  session,
  isShared,
  isLoading,
  isStreaming,
  setInput,
  animation,
  ragStreaming,
  handleRetry
}: ChatList) {
  const chatListRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when a retry occurs
  useEffect(() => {
    const hasRetriedMessage = messages.some(message => message.isRetried)
    if (hasRetriedMessage && chatListRef.current) {
      setTimeout(() => {
        chatListRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [messages])

  if (!messages.length && !isLoading) {
    return null
  }
  console.log(messages, 'messages22223')

  // Find the last bot message index
  const lastBotMessageIndex = messages.reduce((lastIndex, message, index) => {
    if (message.sender === 'receiver' || message.sender === 'bot') {
      return index
    }
    return lastIndex
  }, -1)

  return (
    <div className="relative mx-auto md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl px-4 pb-[200px] md:pb-0">
      {!isShared && !session ? (
        <>
          <div className="group relative mb-4 flex items-start md:-ml-10">
            <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              <p className="text-muted-foreground leading-normal">
                Please{' '}
                <Link href="/login" className="underline">
                  log in
                </Link>{' '}
                {/* or{' '}
                <Link href="/signup" className="underline">
                  sign up
                </Link>{' '}
                to save and revisit your chat history! */}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
        </>
      ) : null}

      {messages.map((message, index) => {
        let onRetryHandler = message.onRetry
        if (
          handleRetry &&
          (message.sender === 'receiver' || message.sender === 'bot') &&
          message.chatId
        ) {
          // Find the previous user message for this bot/receiver message
          let userMessage = ''
          for (let i = index - 1; i >= 0; i--) {
            if (messages[i].sender === 'user') {
              userMessage = messages[i].message
              break
            }
          }
          onRetryHandler = handleRetry(index, userMessage, message.chatId)
        }
        return (
          <div key={index}>
            {message.sender === 'user' ? (
              <UserMessage
                createdTime={message.createdTime}
                isRetried={message.isRetried}
                retryReason={message.retryReason}
              >
                {message.message}
              </UserMessage>
            ) : message.sender === 'receiver' ? (
              <BotMessage
                chatId={message.chatId}
                isStreaming={isStreaming}
                sourceData={message.sourceData}
                citations={message.citations}
                session={session}
                setInput={setInput}
                createdTime={message.createdTime}
                responseTime={message.responseTime}
                isLastMessage={index === lastBotMessageIndex}
                onRetry={onRetryHandler}
                isRetried={message.isRetried}
                retryReason={message.retryReason}
              >
                {message.message}
              </BotMessage>
            ) : (
              message.sender === 'bot' && (
                <>
                  {message.message.length === 0 && animation ? (
                    <SpinnerMessage />
                  ) : (
                    <BotMessage
                      chatId={message.chatId}
                      isStreaming={isStreaming}
                      sourceData={message.sourceData}
                      citations={message.citations}
                      session={session}
                      setInput={setInput}
                      responseTime={message.responseTime}
                      createdTime={message.createdTime}
                      isLastMessage={index === lastBotMessageIndex}
                      onRetry={onRetryHandler}
                      isRetried={message.isRetried}
                      retryReason={message.retryReason}
                    >
                      {message.message}
                    </BotMessage>
                  )}
                </>
              )
            )}
            {index < messages.length - 1 && <br className="my-4" />}
          </div>
        )
      })}
      {/* {!ragStreaming && !animation ? <MessageLoader2 /> : null} */}
      {animation && (
        <>
          {/* <Separator className="my-4" /> */}
          <SpinnerMessage />
        </>
      )}

      {/* Scroll target for auto-scroll functionality */}
      <div ref={chatListRef} className="h-0" />
    </div>
  )
}
