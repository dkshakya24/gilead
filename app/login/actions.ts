'use server'

import { signIn } from '@/auth'
import { User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { ResultCode, USER_MANAGEMENT_API, verifyPassword } from '@/lib/utils'

// API endpoint for authentication

// Interface for API response
interface AuthApiResponse {
  authenticated: boolean
  user: {
    password: string
    role: string
    email: string
    name: string
    access_enabled: string
    user_id: string
  }
}

// Interface for API request
interface AuthApiRequest {
  action: string
  user_id: string
  password: string
}

export async function getUser(
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const payload: AuthApiRequest = {
      action: 'authenticate',
      user_id: email,
      password: password
    }

    console.log(
      'Sending authentication request:',
      JSON.stringify(payload, null, 2)
    )

    const response = await fetch(USER_MANAGEMENT_API, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    console.log('Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        'Authentication API error:',
        response.status,
        response.statusText,
        'Response body:',
        errorText
      )
      return undefined
    }

    const data: AuthApiResponse = await response.json()

    if (data.authenticated && data.user.access_enabled === 'True') {
      // Verify password using bcrypt
      const isPasswordValid = await verifyPassword(password, data.user.password)

      if (!isPasswordValid) {
        console.error('Password verification failed')
        return undefined
      }

      return {
        id: data.user.user_id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        password: data.user.password,
        salt: 'api-auth'
      }
    }

    return undefined
  } catch (error) {
    console.error('Authentication error:', error)
    return undefined
  }
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}
