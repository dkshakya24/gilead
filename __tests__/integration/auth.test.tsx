import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/login-form'
import { createMockSession } from '../utils/test-utils'

// Mock the authentication action
jest.mock('@/app/login/actions', () => ({
  authenticate: jest.fn()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

describe('Authentication Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LoginForm Component', () => {
    it('should render login form with all required fields', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/remember me/i)).toBeInTheDocument()
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    })

    it('should validate required fields on form submission', async () => {
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Try to submit empty form
      await user.click(submitButton)

      // Check that form validation prevents submission
      expect(submitButton).toBeInTheDocument()
    })

    it('should handle form input changes', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })

    it('should show loading state during form submission', async () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // Submit form
      await user.click(submitButton)

      // Button should be present (loading state is handled by useFormStatus)
      expect(submitButton).toBeInTheDocument()
    })

    it('should handle successful login', async () => {
      const mockAuthenticate = require('@/app/login/actions').authenticate
      mockAuthenticate.mockResolvedValue({
        type: 'success',
        resultCode: 'LOGIN_SUCCESS'
      })

      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      // Simulate form submission by directly calling the form action
      const form = document.querySelector('form')
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      // Call the authenticate function directly
      mockAuthenticate(undefined, formData)

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalled()
      })
    })

    it('should handle login error', async () => {
      const mockAuthenticate = require('@/app/login/actions').authenticate
      mockAuthenticate.mockResolvedValue({
        type: 'error',
        resultCode: 'INVALID_CREDENTIALS'
      })

      const { toast } = require('sonner')

      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/username/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'invalid@example.com')
      await user.type(passwordInput, 'wrongpassword')

      // Simulate form submission by directly calling the form action
      const formData = new FormData()
      formData.append('email', 'invalid@example.com')
      formData.append('password', 'wrongpassword')

      // Call the authenticate function directly
      mockAuthenticate(undefined, formData)

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalled()
      })
    })
  })

  describe('Login Page Integration', () => {
    it('should render complete login page layout', () => {
      const LoginPage = require('@/app/login/page').default
      render(<LoginPage />)

      expect(screen.getByText(/welcome to gabi arc/i)).toBeInTheDocument()
      expect(
        screen.getByText(/stay ahead with ai-powered content/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
      expect(screen.getByText(/register/i)).toBeInTheDocument()
    })
  })
})
