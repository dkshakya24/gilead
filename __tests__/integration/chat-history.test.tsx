import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatHistory } from '@/components/chat-history'
import { SidebarList } from '@/components/sidebar-list'
import {
  createMockSession,
  createMockChatHistory,
  mockFetchResponse
} from '../utils/test-utils'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/arc'),
  useRouter: jest.fn(() => ({
    push: jest.fn()
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn()
  }))
}))

// Mock WebSocket store
jest.mock('@/lib/store/websocket-store', () => ({
  useWebSocketStore: () => ({
    isStreaming: false,
    setIsStreaming: jest.fn(),
    refreshChatHistory: false,
    setRefreshChatHistory: jest.fn()
  })
}))

// Mock app store
jest.mock('@/lib/store/useStore', () => ({
  useStore: () => ({
    chatMessages: [],
    setChatMessages: jest.fn(),
    chatId: 'test-chat-id'
  })
}))

// Mock API URL
jest.mock('@/lib/utils', () => ({
  API_URL: 'https://api-test-url.com',
  cn: (...inputs: any) => inputs.join(' ')
}))

// Mock fetch for chat history
const mockTodayChats = [
  {
    Session_id: 'today-chat-1',
    header_name: 'Today Chat 1',
    created_on: new Date().toISOString(),
    user_id: 'test-user-id'
  },
  {
    Session_id: 'today-chat-2',
    header_name: 'Today Chat 2',
    created_on: new Date().toISOString(),
    user_id: 'test-user-id'
  }
]

const mockOtherChats = [
  {
    Session_id: 'old-chat-1',
    header_name: 'Old Chat 1',
    created_on: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    user_id: 'test-user-id'
  },
  {
    Session_id: 'old-chat-2',
    header_name: 'Old Chat 2',
    created_on: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    user_id: 'test-user-id'
  }
]

// Mock chat actions
jest.mock('@/lib/chat/client-actions', () => ({
  removeChatClient: jest.fn(() => Promise.resolve({})),
  editChatClient: jest.fn(() => Promise.resolve({}))
}))

// Mock React.Suspense
jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    Suspense: ({ children }: { children: React.ReactNode }) => children
  }
})

describe('Chat History Integration Tests', () => {
  const user = userEvent.setup()
  const mockSession = createMockSession()
  const userId = 'test-user-id'

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock fetch response for chat history
    mockFetchResponse({
      today: mockTodayChats,
      others: mockOtherChats
    })
  })

  describe('ChatHistory Component', () => {
    it('should render chat history header', () => {
      render(<ChatHistory userId={userId} />)

      // Check for New Chat button
      expect(screen.getByText('+ New Chat')).toBeInTheDocument()

      // Check for search input
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })

    it('should navigate to new chat when button is clicked', async () => {
      // Mock window.location.href
      const originalLocation = window.location
      delete window.location
      window.location = { ...originalLocation, href: '' } as any

      render(<ChatHistory userId={userId} />)

      const newChatButton = screen.getByText('+ New Chat')
      await user.click(newChatButton)

      // Verify navigation
      expect(window.location.href).toBe('/new')

      // Restore original location
      window.location = originalLocation
    })

    it('should filter chats when search is used', async () => {
      render(<SidebarList userId={userId} search="" />)

      // Wait for chat history to load
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api-test-url.com/get-chat-history?user_id=test-user-id',
          expect.objectContaining({ method: 'GET' })
        )
      })

      // Verify all chats are displayed initially
      await waitFor(() => {
        expect(screen.getByText('Today Chat 1')).toBeInTheDocument()
        expect(screen.getByText('Today Chat 2')).toBeInTheDocument()
        expect(screen.getByText('Previous Chats')).toBeInTheDocument()
      })

      // Render again with search term
      render(<SidebarList userId={userId} search="Chat 1" />)

      // Verify only matching chats are displayed
      await waitFor(() => {
        expect(screen.getByText('Today Chat 1')).toBeInTheDocument()
        expect(screen.queryByText('Today Chat 2')).not.toBeInTheDocument()
      })
    })
  })

  describe('SidebarList Component', () => {
    it('should fetch and display chat history', async () => {
      render(<SidebarList userId={userId} />)

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api-test-url.com/get-chat-history?user_id=test-user-id',
          expect.objectContaining({ method: 'GET' })
        )
      })

      // Verify today's chats are displayed
      await waitFor(() => {
        expect(screen.getByText('Today')).toBeInTheDocument()
        expect(screen.getByText('Today Chat 1')).toBeInTheDocument()
        expect(screen.getByText('Today Chat 2')).toBeInTheDocument()
      })

      // Verify previous chats section
      expect(screen.getByText('Previous Chats')).toBeInTheDocument()
    })

    it('should show loading state while fetching chat history', () => {
      // Mock fetch to delay response
      global.fetch = jest.fn(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () =>
                    Promise.resolve({
                      today: mockTodayChats,
                      others: mockOtherChats
                    })
                } as Response),
              100
            )
          )
      )

      render(<SidebarList userId={userId} />)

      // Check for loading state (shimmer)
      const loadingElements = screen.getAllByClassName('animate-pulse')
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('should handle empty chat history', async () => {
      // Mock empty response
      mockFetchResponse({ today: [], others: [] })

      render(<SidebarList userId={userId} />)

      // Wait for API call to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })

      // Verify no chat items are displayed
      expect(screen.queryByText('Today')).not.toBeInTheDocument()
      expect(screen.queryByText('Previous Chats')).not.toBeInTheDocument()
    })

    it('should cache chat history data', async () => {
      // First render to populate cache
      const { unmount } = render(<SidebarList userId={userId} />)

      // Wait for first API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })

      unmount()

      // Reset fetch mock to verify it's not called again
      jest.clearAllMocks()

      // Second render should use cached data
      render(<SidebarList userId={userId} />)

      // Verify chats are displayed without a new API call
      await waitFor(() => {
        expect(screen.getByText('Today Chat 1')).toBeInTheDocument()
      })

      // Verify no additional API call was made
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })
})
