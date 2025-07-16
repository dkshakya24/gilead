import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Session } from '@/lib/types'

// Mock providers and context
const mockSession: Session = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    emailVerified: new Date()
  }
}

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { session?: Session }
) => {
  const { session = mockSession, ...renderOptions } = options || {}

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="test-wrapper">{children}</div>
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data helpers
export const createMockChatMessage = (overrides = {}) => ({
  sender: 'user',
  message: 'Test message',
  chatId: 'test-chat-id',
  createdTime: 'Jan 01, 12:00 PM',
  ...overrides
})

export const createMockSession = (overrides = {}): Session => ({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    emailVerified: new Date(),
    ...overrides
  }
})

// Mock API responses
export const mockApiResponses = {
  login: {
    success: { type: 'success', resultCode: 'LOGIN_SUCCESS' },
    error: { type: 'error', resultCode: 'INVALID_CREDENTIALS' }
  },
  signup: {
    success: { type: 'success', resultCode: 'SIGNUP_SUCCESS' },
    error: { type: 'error', resultCode: 'EMAIL_EXISTS' }
  },
  chat: {
    messages: [
      {
        message_id: 'msg-1',
        message: [
          {
            role: 'user',
            content: 'Hello',
            created_time: new Date().toISOString()
          },
          {
            role: 'assistant',
            content: 'Hi there!',
            created_time: new Date().toISOString()
          }
        ]
      }
    ]
  },
  websocket: {
    connection: { type: 'connection', status: 'connected' },
    message: { type: 'message', content: 'Test response' },
    error: { type: 'error', message: 'Connection failed' }
  },
  feedback: {
    success: { status: 'success', message: 'Feedback submitted' },
    error: { status: 'error', message: 'Failed to submit feedback' }
  }
}

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  emailVerified: new Date(),
  ...overrides
})

export const createMockChatHistory = (overrides: any[] = []) => [
  {
    id: 'chat-1',
    title: 'Test Chat',
    messages: [
      { role: 'user', content: 'Hello', timestamp: new Date() },
      { role: 'assistant', content: 'Hi there!', timestamp: new Date() }
    ],
    createdAt: new Date(),
    ...(overrides[0] || {})
  }
]

export const createMockWebSocketMessage = (overrides = {}) => ({
  type: 'message',
  content: 'Test message',
  timestamp: new Date().toISOString(),
  sender: 'user',
  ...overrides
})

// Test helpers
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

export const mockFetchResponse = (data: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      status,
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'default',
      url: 'http://localhost:3000',
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      clone: () => Promise.resolve({} as Response),
      bytes: () => Promise.resolve(new Uint8Array())
    } as unknown as Response)
  )
}

export const mockWebSocketConnection = () => {
  const mockWebSocket = {
    readyState: 1, // OPEN
    send: jest.fn(),
    close: jest.fn(),
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null
  }

  global.WebSocket = jest.fn(() => mockWebSocket) as any
  return mockWebSocket
}

// Test environment setup
export const setupTestEnvironment = () => {
  // Reset all mocks
  jest.clearAllMocks()

  // Setup default fetch mock
  mockFetchResponse({})

  // Setup default localStorage
  localStorage.clear()
  sessionStorage.clear()

  // Setup default environment variables
  process.env.NEXTAUTH_SECRET = 'test-secret'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

// Common test queries
export const getByTestId = (container: HTMLElement, testId: string) => {
  return container.querySelector(`[data-testid="${testId}"]`)
}

export const getAllByTestId = (container: HTMLElement, testId: string) => {
  return container.querySelectorAll(`[data-testid="${testId}"]`)
}
