import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportDropdown } from '@/components/gilead/export-dropdown'
import { createMockSession, mockFetchResponse } from '../utils/test-utils'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/arc/chat/test-chat-id'),
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
    chatMessages: [
      {
        sender: 'user',
        message: 'What is the treatment for hypertension?',
        chatId: 'q1-chat-id'
      },
      {
        sender: 'assistant',
        message: 'The treatment for hypertension includes...',
        chatId: 'q1-chat-id'
      },
      {
        sender: 'user',
        message: 'What are the side effects?',
        chatId: 'q2-chat-id'
      },
      {
        sender: 'assistant',
        message: 'Common side effects include...',
        chatId: 'q2-chat-id'
      }
    ],
    chatId: 'test-chat-id',
    setChatMessages: jest.fn()
  })
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn()
  }
}))

// Mock API URLs
jest.mock('@/lib/utils', () => ({
  API_URL: 'https://api-test-url.com',
  PROJECT_NAME: 'Test Project',
  PPT_GENERATE_API: 'https://ppt-generate-api.com',
  PPT_DOWNLOAD_API: 'https://ppt-download-api.com',
  DOCX_GENERATE_API: 'https://docx-generate-api.com'
}))

// Mock document methods for file download
const mockCreateElement = jest.fn()
const mockAppendChild = jest.fn()
const mockClick = jest.fn()
const mockRemoveChild = jest.fn()

Object.defineProperty(document, 'createElement', {
  value: (tag: string) => {
    if (tag === 'a') {
      return {
        href: '',
        download: '',
        click: mockClick
      }
    }
    return mockCreateElement(tag)
  },
  writable: true
})

Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
  writable: true
})

Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
  writable: true
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')

// Mock atob
global.atob = jest.fn(str => Buffer.from(str, 'base64').toString('binary'))

describe('Export and Download Integration Tests', () => {
  const user = userEvent.setup()
  const mockSession = createMockSession()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ExportDropdown Component', () => {
    it('should render export dropdown button', () => {
      render(<ExportDropdown session={mockSession} />)

      const exportButton = screen.getByText('Export')
      expect(exportButton).toBeInTheDocument()
    })

    it('should open dropdown menu when clicked', async () => {
      render(<ExportDropdown session={mockSession} />)

      const exportButton = screen.getByText('Export')
      await user.click(exportButton)

      // Check if dropdown options are displayed
      expect(screen.getByText('Word')).toBeInTheDocument()
      expect(screen.getByText('PPT')).toBeInTheDocument()
      expect(screen.getByText('PDF')).toBeInTheDocument()
      expect(screen.getByText('Mail')).toBeInTheDocument()
    })

    it('should handle DOCX export when Word option is clicked', async () => {
      // Mock successful API response for DOCX generation
      mockFetchResponse({
        body: {
          docx: {
            file: 'base64encodedcontent',
            fileName: 'test-document.docx'
          }
        }
      })

      render(<ExportDropdown session={mockSession} />)

      // Open dropdown and click Word option
      const exportButton = screen.getByText('Export')
      await user.click(exportButton)

      const wordOption = screen.getByText('Word')
      await user.click(wordOption)

      // Verify API call and download functionality
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://docx-generate-api.com',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            })
          })
        )
      })

      // Verify download was triggered
      expect(mockClick).toHaveBeenCalled()
    })

    it('should open PPT modal when PPT option is clicked', async () => {
      render(<ExportDropdown session={mockSession} />)

      // Open dropdown and click PPT option
      const exportButton = screen.getByText('Export')
      await user.click(exportButton)

      const pptOption = screen.getByText('PPT')
      await user.click(pptOption)

      // Verify modal is opened
      await waitFor(() => {
        expect(screen.getByText('Export to PowerPoint')).toBeInTheDocument()
      })
    })

    it('should handle PPT generation and download process', async () => {
      // Mock successful API responses for PPT generation and download
      mockFetchResponse({
        presentation_id: 'test-presentation-id'
      })

      // Second fetch for download
      mockFetchResponse({
        pptx_base64: 'base64encodedcontent',
        presentation_name: 'test-presentation.pptx'
      })

      render(<ExportDropdown session={mockSession} />)

      // Open dropdown and click PPT option
      const exportButton = screen.getByText('Export')
      await user.click(exportButton)

      const pptOption = screen.getByText('PPT')
      await user.click(pptOption)

      // In the modal, select some questions
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0]) // Select first question
      })

      // Submit the form
      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      // Verify API calls
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://ppt-generate-api.com',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'User-Id': mockSession.user.email,
              'Content-Type': 'application/json'
            })
          })
        )
      })

      // Verify download was triggered
      expect(mockClick).toHaveBeenCalled()
    })
  })
})
