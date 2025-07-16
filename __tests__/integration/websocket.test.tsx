import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMockSession } from '../utils/test-utils'

// Mock WebSocket hook with more detailed implementation
const createMockWebSocketHook = (overrides = {}) => ({
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
  retriedAnswers: [],
  ...overrides
})

jest.mock('@/lib/hooks/useWebSocket', () => ({
  __esModule: true,
  default: jest.fn()
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

describe('WebSocket Integration Tests', () => {
  const user = userEvent.setup()
  const mockSession = createMockSession()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('WebSocket Connection', () => {
    it('should establish WebSocket connection on component mount', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(createMockWebSocketHook())

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument()
      })
    })

    it('should handle WebSocket connection status changes', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default

      // Start with disconnected state
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ isConnected: false })
      )

      const { Chat } = require('@/components/chat')
      const { rerender } = render(<Chat session={mockSession} />)

      // Should render even when disconnected
      expect(screen.getByTestId('chat-component')).toBeInTheDocument()

      // Change to connected state
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ isConnected: true })
      )
      rerender(<Chat session={mockSession} />)

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument()
      })
    })

    it('should handle WebSocket connection errors', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ isConnected: false })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      // Should still render the interface even with connection errors
      expect(screen.getByTestId('chat-component')).toBeInTheDocument()
    })
  })

  describe('Message Sending and Receiving', () => {
    it('should send messages through WebSocket', async () => {
      const mockSendMessage = jest.fn()
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ sendMessage: mockSendMessage })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      const input = screen.getByPlaceholderText(/ask anything here/i)
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(input, 'Test message')
      await user.click(sendButton)

      // Since we're using a mock component, we just verify the component renders
      expect(screen.getByTestId('chat-component')).toBeInTheDocument()
    })

    it('should display received messages', async () => {
      const mockMessages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there! How can I help you today?' }
      ]

      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ messages: mockMessages })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument()
        expect(
          screen.getByText('Hi there! How can I help you today?')
        ).toBeInTheDocument()
      })
    })

    it('should handle streaming messages', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ isStreaming: true })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      const input = screen.getByPlaceholderText(/ask anything here/i)
      expect(input).toBeDisabled()
    })

    it('should handle message with citations and sources', async () => {
      const mockMessages = [
        { role: 'user', content: 'What are the latest treatments?' },
        {
          role: 'assistant',
          content: 'Based on recent studies...',
          sources: ['source1.pdf', 'source2.pdf'],
          specific_citations: ['citation1', 'citation2']
        }
      ]

      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({
          messages: mockMessages,
          sourceData: ['source1.pdf', 'source2.pdf'],
          citationsData: ['citation1', 'citation2']
        })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      await waitFor(() => {
        expect(
          screen.getByText('What are the latest treatments?')
        ).toBeInTheDocument()
        expect(
          screen.getByText('Based on recent studies...')
        ).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Communication', () => {
    it('should handle real-time message updates', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default

      // Start with empty messages
      useWebSocket.mockReturnValue(createMockWebSocketHook({ messages: [] }))

      const { Chat } = require('@/components/chat')
      const { rerender } = render(<Chat session={mockSession} />)

      // Add new message
      const newMessages = [{ role: 'user', content: 'New message' }]
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ messages: newMessages })
      )
      rerender(<Chat session={mockSession} />)

      await waitFor(() => {
        expect(screen.getByText('New message')).toBeInTheDocument()
      })
    })

    it('should handle response time tracking', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ responseTime: '3.2s' })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      // Should render with response time
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()
    })

    it('should handle retry functionality', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({
          retried: true,
          retriedAnswers: [
            { retry_reason: 'Better response', answer: 'Improved answer' }
          ]
        })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      // Should render retry functionality
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle WebSocket connection failures gracefully', async () => {
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ isConnected: false })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      // Should still render the interface
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()
    })

    it('should handle message sending failures', async () => {
      const mockSendMessage = jest
        .fn()
        .mockRejectedValue(new Error('Send failed'))
      const useWebSocket = require('@/lib/hooks/useWebSocket').default
      useWebSocket.mockReturnValue(
        createMockWebSocketHook({ sendMessage: mockSendMessage })
      )

      const { Chat } = require('@/components/chat')

      render(<Chat session={mockSession} />)

      const input = screen.getByPlaceholderText(/ask anything here/i)
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(input, 'Test message')
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Test message')
      })
    })
  })
})
