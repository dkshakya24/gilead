'use client'

import { useState } from 'react'
import { getUserClient } from '@/lib/chat/client-actions'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui/input-field'
import { toast } from 'sonner'

/**
 * Example component demonstrating client-side user authentication
 *
 * This component shows how to use getUserClient for client-side validation
 * without relying on server actions. This can be useful for:
 * - Real-time validation
 * - Pre-submission checks
 * - Custom authentication flows
 */
export function ExampleClientAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleClientValidation = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsValidating(true)
    try {
      const user = await getUserClient(email, password)

      if (user) {
        toast.success(
          `Welcome ${user.name}! Client-side validation successful.`
        )
        console.log('User authenticated via client-side:', user)
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Authentication failed')
      console.error('Client-side auth error:', error)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        Client-Side Authentication Example
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        This demonstrates using getUserClient for client-side validation. Note:
        This is for demonstration purposes only. In production, you should use
        server actions with NextAuth for security.
      </p>

      <div className="space-y-4">
        <InputField
          type="email"
          icon="mail"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <InputField
          type="password"
          icon="lock"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <Button
          onClick={handleClientValidation}
          disabled={isValidating}
          className="w-full"
        >
          {isValidating ? 'Validating...' : 'Validate Credentials'}
        </Button>
      </div>
    </div>
  )
}
