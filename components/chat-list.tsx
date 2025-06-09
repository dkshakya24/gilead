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

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
  isLoading: boolean
  isStreaming?: boolean
  animation?: boolean
  ragStreaming?: boolean
  setInput?: (msg: string) => void
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
  ragStreaming
}: ChatList) {
  if (!messages.length && !isLoading) {
    return null
  }
  console.log(messages, 'messages22223')

  return (
    <div className="relative mx-auto md:max-w-3xl lg:max-w-4xl xl:max-w-4xl 2xl:max-w-8xl px-4 pb-[200px] md:pb-0">
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

      {messages.map((message, index) => (
        <div key={index}>
          {message.sender === 'user' ? (
            <UserMessage createdTime={message.createdTime}>
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
                  >
                    {message.message}
                  </BotMessage>
                )}
              </>
            )
          )}
          {index < messages.length - 1 && <br className="my-4" />}
        </div>
      ))}
      {!ragStreaming && !animation ? <MessageLoader2 /> : null}
      {!isStreaming && isLoading && (
        <>
          {/* <Separator className="my-4" /> */}
          <SpinnerMessage />
        </>
      )}
    </div>
  )
}
