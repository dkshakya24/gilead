import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chat } from '@/components/chat'
import { createMockSession } from '../utils/test-utils'

// Mock WebSocket hook
jest.mock('@/lib/hooks/useWebSocket', () => ({
  __esModule: true,
  default: () => ({
    messages: [],
    sendMessage: jest.fn(),
    isConnected: true,
    emptyMessages: jest.fn(),
    isStreaming: false,
    chat_id: 'test-chat-id',
    sourceData: [],
    citationsData: [],
    animation: false,
    ragStreaming: false,
    responseTime: '2.5s',
    retried: false,
    retriedAnswers: []
  })
}))

// Mock store
jest.mock('@/lib/store/useStore', () => ({
  useStore: () => ({
    reasoning: 'HIGH',
    chatMessages: [],
    setChatMessages: jest.fn(),
    chatId: 'test-chat-id',
    setChatId: jest.fn(),
    selectedUrls: []
  })
}))

// Mock chat actions
jest.mock('@/lib/chat/client-actions', () => ({
  getChatClient: jest.fn()
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

describe('Chat Integration Tests', () => {
  const user = userEvent.setup()
  const mockSession = createMockSession()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Chat Component', () => {
    it('should render chat interface with input form', () => {
      render(<Chat session={mockSession} />)

      // Check for chat input area
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()

      // Check for send button
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    })

    it('should handle message input and submission', async () => {
      const mockSendMessage = jest.fn()
      jest.doMock('@/lib/hooks/useWebSocket', () => ({
        __esModule: true,
        default: () => ({
          messages: [],
          sendMessage: mockSendMessage,
          isConnected: true,
          emptyMessages: jest.fn(),
          isStreaming: false,
          chat_id: 'test-chat-id',
          sourceData: [],
          citationsData: [],
          animation: false,
          ragStreaming: false,
          responseTime: '2.5s',
          retried: false,
          retriedAnswers: []
        })
      }))

      render(<Chat session={mockSession} />)

      const input = screen.getByPlaceholderText(/ask anything here/i)
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(input, 'Hello, how are you?')
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Hello, how are you?')
      })
    })

    it('should display chat messages', () => {
      const mockMessages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there! How can I help you?' }
      ]

      jest.doMock('@/lib/hooks/useWebSocket', () => ({
        __esModule: true,
        default: () => ({
          messages: mockMessages,
          sendMessage: jest.fn(),
          isConnected: true,
          emptyMessages: jest.fn(),
          isStreaming: false,
          chat_id: 'test-chat-id',
          sourceData: [],
          citationsData: [],
          animation: false,
          ragStreaming: false,
          responseTime: '2.5s',
          retried: false,
          retriedAnswers: []
        })
      }))

      render(<Chat session={mockSession} />)

      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(
        screen.getByText('Hi there! How can I help you?')
      ).toBeInTheDocument()
    })

    it('should show loading state during message streaming', () => {
      jest.doMock('@/lib/hooks/useWebSocket', () => ({
        __esModule: true,
        default: () => ({
          messages: [],
          sendMessage: jest.fn(),
          isConnected: true,
          emptyMessages: jest.fn(),
          isStreaming: true,
          chat_id: 'test-chat-id',
          sourceData: [],
          citationsData: [],
          animation: false,
          ragStreaming: false,
          responseTime: '2.5s',
          retried: false,
          retriedAnswers: []
        })
      }))

      render(<Chat session={mockSession} />)

      const input = screen.getByPlaceholderText(/ask anything here/i)
      expect(input).toBeDisabled()
    })

    it('should handle WebSocket connection status', () => {
      jest.doMock('@/lib/hooks/useWebSocket', () => ({
        __esModule: true,
        default: () => ({
          messages: [],
          sendMessage: jest.fn(),
          isConnected: false,
          emptyMessages: jest.fn(),
          isStreaming: false,
          chat_id: 'test-chat-id',
          sourceData: [],
          citationsData: [],
          animation: false,
          ragStreaming: false,
          responseTime: '2.5s',
          retried: false,
          retriedAnswers: []
        })
      }))

      render(<Chat session={mockSession} />)

      // Should still render the interface even when disconnected
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()
    })
  })

  describe('ChatPanel Component', () => {
    it('should render chat panel with input form', () => {
      const { ChatPanel } = require('@/components/chat-panel')

      render(
        <ChatPanel
          input=""
          setInput={jest.fn()}
          onSubmit={jest.fn()}
          isAtBottom={true}
          scrollToBottom={jest.fn()}
          scrollToTop={jest.fn()}
        />
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should handle form submission', async () => {
      const { ChatPanel } = require('@/components/chat-panel')
      const mockOnSubmit = jest.fn()
      const mockSetInput = jest.fn()

      render(
        <ChatPanel
          input="Test message"
          setInput={mockSetInput}
          onSubmit={mockOnSubmit}
          isAtBottom={true}
          scrollToBottom={jest.fn()}
          scrollToTop={jest.fn()}
        />
      )

      const form = screen.getByRole('textbox').closest('form')
      if (form) {
        await user.click(form)
        await user.keyboard('{Enter}')

        await waitFor(() => {
          expect(mockOnSubmit).toHaveBeenCalled()
        })
      }
    })
  })

  describe('PromptForm Component', () => {
    it('should render prompt form with textarea', () => {
      const { PromptForm } = require('@/components/prompt-form')

      render(<PromptForm input="" setInput={jest.fn()} onSubmit={jest.fn()} />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should handle input changes', async () => {
      const { PromptForm } = require('@/components/prompt-form')
      const mockSetInput = jest.fn()

      render(
        <PromptForm input="" setInput={mockSetInput} onSubmit={jest.fn()} />
      )

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'New message')

      expect(mockSetInput).toHaveBeenCalledWith('New message')
    })

    it('should prevent submission when streaming', async () => {
      const { PromptForm } = require('@/components/prompt-form')
      const mockOnSubmit = jest.fn()

      render(
        <PromptForm
          input="Test message"
          setInput={jest.fn()}
          onSubmit={mockOnSubmit}
          isStreaming={true}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })
  })
})
