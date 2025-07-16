import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { createMockSession } from '../utils/test-utils'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  }),
  usePathname: () => '/arc',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn()
}))

// Mock auth
jest.mock('@/auth', () => ({
  auth: jest.fn()
}))

describe('Routing Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Main Page Flow', () => {
    it('should redirect to /arc from root path', async () => {
      const HomePage = require('@/app/page').default
      const { redirect } = require('next/navigation')

      // Mock the redirect function
      redirect.mockImplementation(() => {
        throw new Error('REDIRECT')
      })

      // Test that the component throws the expected error
      expect(() => {
        render(<HomePage />)
      }).toThrow('REDIRECT')

      // Verify redirect was called with correct path
      expect(redirect).toHaveBeenCalledWith('/arc')
    })

    it('should render arc page with authentication check', async () => {
      const ArcPage = require('@/app/arc/(chat)/page').default
      const { auth } = require('@/auth')

      const mockSession = createMockSession()
      auth.mockResolvedValue(mockSession)

      render(<ArcPage />)

      // Should render without redirecting when session exists
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/ask anything here/i)
        ).toBeInTheDocument()
      })
    })

    it('should redirect to login when no session', async () => {
      const ArcPage = require('@/app/arc/(chat)/page').default
      const { auth } = require('@/auth')
      const { redirect } = require('next/navigation')

      auth.mockResolvedValue(null)

      // Mock redirect to throw error so we can catch it
      redirect.mockImplementation(() => {
        throw new Error('REDIRECT')
      })

      expect(() => {
        render(<ArcPage />)
      }).toThrow('REDIRECT')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('Authentication Flow', () => {
    it('should handle authenticated user access to protected routes', async () => {
      const mockSession = createMockSession()
      const { auth } = require('@/auth')

      auth.mockResolvedValue(mockSession)

      // Test that authenticated users can access the chat page
      const ChatComponent = require('@/components/chat').Chat

      render(<ChatComponent session={mockSession} />)

      // Should render without redirecting
      expect(
        screen.getByPlaceholderText(/ask anything here/i)
      ).toBeInTheDocument()
    })

    it('should handle unauthenticated user access to protected routes', async () => {
      const { auth } = require('@/auth')
      const { redirect } = require('next/navigation')

      auth.mockResolvedValue(null)

      // Mock redirect to throw error so we can catch it
      redirect.mockImplementation(() => {
        throw new Error('REDIRECT')
      })

      const ArcPage = require('@/app/arc/(chat)/page').default

      expect(() => {
        render(<ArcPage />)
      }).toThrow('REDIRECT')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('Page Layout Integration', () => {
    it('should render login page with proper layout', () => {
      const LoginPage = require('@/app/login/page').default

      render(<LoginPage />)

      // Check for main layout elements
      expect(screen.getByText(/welcome to gabi arc/i)).toBeInTheDocument()
      expect(
        screen.getByText(/stay ahead with ai-powered content/i)
      ).toBeInTheDocument()

      // Check for form elements
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
    })

    it('should render arc page with chat interface', async () => {
      const ArcPage = require('@/app/arc/(chat)/page').default
      const { auth } = require('@/auth')

      const mockSession = createMockSession()
      auth.mockResolvedValue(mockSession)

      render(<ArcPage />)

      await waitFor(() => {
        // Should render chat interface
        expect(
          screen.getByPlaceholderText(/ask anything here/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Session Management', () => {
    it('should handle session with different user roles', async () => {
      const mockAdminSession = createMockSession({ role: 'admin' })
      const mockUserSession = createMockSession({ role: 'user' })

      const { auth } = require('@/auth')

      // Test admin session
      auth.mockResolvedValue(mockAdminSession)

      const ArcPage = require('@/app/arc/(chat)/page').default
      render(<ArcPage />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/ask anything here/i)
        ).toBeInTheDocument()
      })

      // Test user session
      auth.mockResolvedValue(mockUserSession)

      render(<ArcPage />)

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/ask anything here/i)
        ).toBeInTheDocument()
      })
    })

    it('should handle session expiration', async () => {
      const { auth } = require('@/auth')
      const { redirect } = require('next/navigation')

      // Mock expired session
      auth.mockResolvedValue(null)

      redirect.mockImplementation(() => {
        throw new Error('REDIRECT')
      })

      const ArcPage = require('@/app/arc/(chat)/page').default

      expect(() => {
        render(<ArcPage />)
      }).toThrow('REDIRECT')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})
