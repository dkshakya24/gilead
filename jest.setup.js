import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    }
  },
  usePathname() {
    return '/arc'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  redirect: jest.fn().mockImplementation(() => {
    throw new Error('REDIRECT')
  })
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  }
}))

// Mock React DOM hooks that are not available in React 18
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: (action, initialState) => {
    const [state, setState] = React.useState(initialState)
    const formAction = React.useCallback(
      formData => {
        // Call the action and update state
        const result = action(state, formData)
        setState(result)
        return result
      },
      [action, state]
    )
    return [state, formAction]
  },
  useFormStatus: () => ({
    pending: false
  })
}))

// Mock the authenticate function to be called when form is submitted
jest.mock('@/app/login/actions', () => ({
  authenticate: jest.fn().mockImplementation((prevState, formData) => {
    // Extract email and password from FormData
    const email = formData.get('email')
    const password = formData.get('password')

    // Return a mock result
    return {
      type: 'success',
      resultCode: 'LOGIN_SUCCESS'
    }
  })
}))

// Mock the signup actions
jest.mock('@/app/signup/actions', () => ({
  signup: jest.fn().mockImplementation((prevState, formData) => {
    return {
      type: 'success',
      resultCode: 'SIGNUP_SUCCESS'
    }
  })
}))

// Mock external libraries
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  }
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}))

jest.mock('react-textarea-autosize', () => {
  const React = require('react')
  return React.forwardRef((props, ref) => {
    return React.createElement('textarea', { ...props, ref })
  })
})

jest.mock('react-markdown', () => {
  const React = require('react')
  return ({ children }) => React.createElement('div', {}, children)
})

// Mock Radix UI components
jest.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }) => children,
  DialogContent: ({ children }) => children,
  DialogHeader: ({ children }) => children,
  DialogTitle: ({ children }) => children,
  DialogTrigger: ({ children }) => children
}))

// Mock custom UI components
jest.mock('@/components/ui/input-field', () => ({
  InputField: ({ label, ...props }) => (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input {...props} />
    </div>
  )
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ label, ...props }) => (
    <div>
      <input type="checkbox" {...props} />
      <label>{label}</label>
    </div>
  )
}))

jest.mock('@/components/ui/new-button', () => ({
  Button: ({ children, fullWidth, variant, ...props }) => (
    <button {...props}>{children}</button>
  )
}))

jest.mock('@/components/ui/icons', () => ({
  IconSpinner: () => <span>Loading...</span>
}))

jest.mock('@radix-ui/react-dropdown-menu', () => ({
  DropdownMenu: ({ children }) => children,
  DropdownMenuTrigger: ({ children }) => children,
  DropdownMenuContent: ({ children }) => children,
  DropdownMenuItem: ({ children }) => children
}))

jest.mock('@radix-ui/react-tooltip', () => ({
  Tooltip: ({ children }) => children,
  TooltipContent: ({ children }) => children,
  TooltipTrigger: ({ children }) => children,
  TooltipProvider: ({ children }) => children,
  TooltipPrimitive: {
    Provider: ({ children }) => children,
    Root: ({ children }) => children,
    Trigger: ({ children }) => children,
    Content: {
      displayName: 'TooltipContent'
    }
  }
}))

jest.mock('@radix-ui/react-alert-dialog', () => ({
  AlertDialog: ({ children }) => children,
  AlertDialogContent: ({ children }) => children,
  AlertDialogHeader: ({ children }) => children,
  AlertDialogTitle: ({ children }) => children,
  AlertDialogTrigger: ({ children }) => children,
  AlertDialogPrimitive: {
    Root: ({ children }) => children,
    Trigger: ({ children }) => children,
    Portal: ({ children }) => children,
    Overlay: {
      displayName: 'AlertDialogOverlay'
    },
    Content: {
      displayName: 'AlertDialogContent'
    },
    Title: {
      displayName: 'AlertDialogTitle'
    },
    Description: {
      displayName: 'AlertDialogDescription'
    },
    Action: {
      displayName: 'AlertDialogAction'
    },
    Cancel: {
      displayName: 'AlertDialogCancel'
    }
  }
}))

jest.mock('@radix-ui/react-select', () => ({
  Select: ({ children }) => children,
  SelectContent: ({ children }) => children,
  SelectItem: ({ children }) => children,
  SelectTrigger: ({ children }) => children,
  SelectValue: ({ children }) => children
}))

jest.mock('@radix-ui/react-switch', () => ({
  Switch: ({ children }) => children,
  SwitchThumb: ({ children }) => children,
  SwitchPrimitives: {
    Root: {
      displayName: 'Switch'
    }
  }
}))

// Removed @radix-ui/react-checkbox mock as it's not installed

jest.mock('@radix-ui/react-label', () => ({
  Label: ({ children }) => children
}))

jest.mock('@radix-ui/react-separator', () => ({
  Separator: ({ children }) => children
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ children }) => children,
  SeparatorPrimitive: {
    Root: {
      displayName: 'Separator'
    }
  }
}))

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children }) => children
}))

jest.mock('@radix-ui/react-accordion', () => ({
  Accordion: ({ children }) => children,
  AccordionContent: ({ children }) => children,
  AccordionItem: ({ children }) => children,
  AccordionTrigger: ({ children }) => children
}))

jest.mock('@radix-ui/react-icons', () => ({
  IconSpinner: () => <span>Loading...</span>,
  IconArrowRight: () => <span>→</span>,
  IconArrowLeft: () => <span>←</span>,
  IconPlus: () => <span>+</span>,
  IconMinus: () => <span>-</span>,
  IconCheck: () => <span>✓</span>,
  IconCross: () => <span>✕</span>
}))

// Mock chart libraries
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart">Chart</div>,
  Bar: () => <div data-testid="chart">Chart</div>,
  Pie: () => <div data-testid="chart">Chart</div>
}))

jest.mock('react-plotly.js', () => {
  const React = require('react')
  return () =>
    React.createElement(
      'div',
      { 'data-testid': 'plotly-chart' },
      'Plotly Chart'
    )
})

// Mock carousel
jest.mock('embla-carousel-react', () => ({
  useCarousel: () => ({
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    canScrollPrev: false,
    canScrollNext: true
  })
}))

// Mock zustand store
jest.mock('zustand', () => ({
  create: fn => fn
}))

// Mock store hooks
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

jest.mock('@/lib/store/websocket-store', () => ({
  useWebSocketStore: () => ({
    isStreaming: false,
    setIsStreaming: jest.fn(),
    ragStreaming: false,
    setRagStreaming: jest.fn(),
    isSuggestions: true,
    setIsSuggestions: jest.fn(),
    retried: false,
    setRetried: jest.fn(),
    retriedAnswers: [],
    setRetriedAnswers: jest.fn(),
    currentRetryReason: null,
    setCurrentRetryReason: jest.fn()
  })
}))

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id-123'
}))

// Mock chat actions
jest.mock('@/lib/chat/client-actions', () => ({
  getChatClient: jest.fn().mockResolvedValue({
    messages: [],
    chat_id: 'test-chat-id'
  })
}))

jest.mock('@/lib/chat/actions', () => ({
  getChat: jest.fn(),
  createChat: jest.fn(),
  updateChat: jest.fn()
}))

// Mock Chat component
jest.mock('@/components/chat', () => ({
  Chat: ({ session, ...props }) => {
    const [messages, setMessages] = React.useState([])
    const [isStreaming, setIsStreaming] = React.useState(false)
    const [inputValue, setInputValue] = React.useState('')

    // Mock WebSocket hook
    const useWebSocket = require('@/lib/hooks/useWebSocket').default
    const mockWebSocket = useWebSocket()

    React.useEffect(() => {
      if (mockWebSocket.messages) {
        setMessages(mockWebSocket.messages)
      }
      if (mockWebSocket.isStreaming !== undefined) {
        setIsStreaming(mockWebSocket.isStreaming)
      }
    }, [mockWebSocket.messages, mockWebSocket.isStreaming])

    const handleSend = async () => {
      if (inputValue.trim() && mockWebSocket.sendMessage) {
        try {
          await mockWebSocket.sendMessage(inputValue)
        } catch (err) {
          // Optionally, set an error state or log
        }
        setInputValue('')
      }
    }

    return (
      <div data-testid="chat-component">
        <input
          placeholder="Ask anything here..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={isStreaming}
        />
        <button onClick={handleSend} disabled={isStreaming}>
          Send
        </button>
        <div data-testid="messages">
          {messages.map((msg, index) => (
            <div key={index} data-testid={`message-${index}`}>
              {msg.content || msg.message}
            </div>
          ))}
        </div>
      </div>
    )
  }
}))

// Mock ChatPanel component
jest.mock('@/components/chat-panel', () => ({
  ChatPanel: ({ children, onSubmit, ...props }) => {
    const [inputValue, setInputValue] = React.useState('')

    const handleSubmit = e => {
      e.preventDefault()
      if (onSubmit && inputValue.trim()) {
        onSubmit(inputValue)
        setInputValue('')
      }
    }

    return (
      <div data-testid="chat-panel">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Ask anything here..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
        {children}
      </div>
    )
  }
}))

// Mock PromptForm component
jest.mock('@/components/prompt-form', () => ({
  PromptForm: ({ children, setInput, isStreaming, ...props }) => {
    const [inputValue, setInputValue] = React.useState('')

    const handleChange = e => {
      const value = e.target.value
      setInputValue(value)
      if (setInput) {
        setInput(value)
      }
    }

    return (
      <div data-testid="prompt-form">
        <textarea
          placeholder="Ask anything here..."
          value={inputValue}
          onChange={handleChange}
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          Send
        </button>
        {children}
      </div>
    )
  }
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}))

// Mock date-fns
jest.mock('date-fns', () => ({
  format: (date, format) => 'Jan 01, 2024',
  parseISO: date => new Date(date),
  isToday: () => false,
  isYesterday: () => false
}))

// Mock utils
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  getMessageFromCode: code => `Message for code: ${code}`,
  ResultCode: {
    UserLoggedIn: 'LOGIN_SUCCESS',
    InvalidCredentials: 'INVALID_CREDENTIALS',
    UnknownError: 'UNKNOWN_ERROR'
  }
}))

// Mock luxon
jest.mock('luxon', () => ({
  DateTime: {
    now: () => ({ toISO: () => '2024-01-01T00:00:00.000Z' }),
    fromISO: date => ({ toFormat: () => 'Jan 01, 2024' })
  }
}))

// Mock WebSocket
global.WebSocket = class MockWebSocket {
  constructor(url) {
    this.url = url
    this.readyState = 0 // CONNECTING
    this.onopen = null
    this.onmessage = null
    this.onclose = null
    this.onerror = null

    // Simulate connection
    setTimeout(() => {
      this.readyState = 1 // OPEN
      if (this.onopen) this.onopen()
    }, 100)
  }

  send(data) {
    if (this.onmessage) {
      this.onmessage({
        data: JSON.stringify({ type: 'response', content: 'Mock response' })
      })
    }
  }

  close() {
    this.readyState = 3 // CLOSED
    if (this.onclose) this.onclose()
  }
}

// Mock HTMLFormElement.requestSubmit for JSDOM
if (typeof HTMLFormElement !== 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function (submitter) {
    // Simulate form submission by calling the form action
    const formData = new FormData(this)

    // Find the form action function from the form's action attribute or data attributes
    const actionAttr = this.getAttribute('action')
    const formAction =
      this.querySelector('[data-form-action]')?.getAttribute('data-form-action')

    // If there's a form action, call it
    if (formAction && typeof window[formAction] === 'function') {
      window[formAction](formData)
    }

    // Also dispatch the submit event
    const event = new Event('submit', { bubbles: true, cancelable: true })
    this.dispatchEvent(event)
  }
}

// Mock additional browser APIs that might not be available in JSDOM
if (typeof window !== 'undefined') {
  // Mock requestAnimationFrame if not available
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = callback => setTimeout(callback, 16)
  }

  // Mock cancelAnimationFrame if not available
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = id => clearTimeout(id)
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.sessionStorage = sessionStorageMock

// Mock fetch with default responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200
  })
)

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.AUTH_SECRET = 'test-auth-secret'
process.env.WEBSOCKET = 'ws://localhost:8080'
process.env.FEEDBACK_API = 'http://localhost:3001'
process.env.SUGGESTION_API = 'http://localhost:3002'

// Mock IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes(
          'Warning: Invalid value for prop `action` on <form> tag'
        ) ||
        args[0].includes(
          'Error: Not implemented: HTMLFormElement.prototype.requestSubmit'
        ))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
