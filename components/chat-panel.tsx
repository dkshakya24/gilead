import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { ButtonScrollToTop } from './button-scroll-to-top'
// import { useAIState, useActions, useUIState } from 'ai/rsc'
// import type { AI } from '@/lib/chat/actions'
// import { nanoid } from 'nanoid'
// import { UserMessage } from './stocks/message'
export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  scrollToTop: () => void
  onSubmit: () => void
  isStreaming?: boolean
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  onSubmit,
  isStreaming,
  scrollToBottom,
  scrollToTop
}: ChatPanelProps) {
  // const [aiState] = useAIState()
  const [messages, setMessages] = React.useState<any>()
  // const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  return (
    <div className="w-full duration-300 ease-in-out animate-in">
      {/* <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      <ButtonScrollToTop isAtBottom={isAtBottom} scrollToTop={scrollToTop} /> */}

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[320px] peer-[[data-state=open]]:lg:max-w-[calc(100%-250px)] peer-[[data-state=open]]:xl:max-w-[calc(100%-320px)]">
        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center mb-4">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <PromptForm
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  )
}
