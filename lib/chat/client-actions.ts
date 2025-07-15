/**
 * Client-side API functions for chat and user management
 *
 * This file contains client-side versions of API calls that can be used in React components.
 *
 * IMPORTANT: User Authentication Functions
 *
 * There are two versions of user authentication functions:
 *
 * 1. Server-side getUser (in app/login/actions.ts):
 *    - Used by NextAuth.js for authentication
 *    - Used in server actions (login, signup)
 *    - Runs on the server side
 *    - Import: import { getUser } from '@/app/login/actions'
 *
 * 2. Client-side getUserClient (in this file):
 *    - Can be used in React components for client-side validation
 *    - Runs in the browser
 *    - Import: import { getUserClient } from '@/lib/chat/client-actions'
 *
 * Usage Examples:
 *
 * Server-side (NextAuth, server actions):
 * ```typescript
 * import { getUser } from '@/app/login/actions'
 * const user = await getUser(email, password)
 * ```
 *
 * Client-side (React components):
 * ```typescript
 * import { getUserClient } from '@/lib/chat/client-actions'
 * const user = await getUserClient(email, password)
 * ```
 */

import { API_URL, EDIT_DELETE_CHAT_API, USER_MANAGEMENT_API } from '@/lib/utils'
import { User } from '@/lib/types'

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

export async function getUserClient(
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
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
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
      return {
        id: data.user.user_id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        password: data.user.password, // Note: In production, you might not want to store this
        salt: 'api-auth' // Default salt for API authenticated users
      }
    }

    return undefined
  } catch (error) {
    console.error('Authentication error:', error)
    return undefined
  }
}

export async function getChatClient(session_id: string, user_id: string) {
  try {
    const response = await fetch(
      `${API_URL}/get-chat-history?user_id=${user_id}&session_id=${session_id}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const resp = await response.json()
    return resp
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to fetch chat data'
    }
  }
}

export async function editChatClient({
  Session_id,
  header_name,
  user_id
}: {
  Session_id: string
  header_name: string
  user_id: string
}) {
  try {
    const payload = {
      action: 'edit_chatname',
      user_id: user_id,
      session_id: Session_id,
      new_name: header_name
    }

    const response = await fetch(`${EDIT_DELETE_CHAT_API}/editchat`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const resp = await response.json()
    console.log('Chat title updated successfully', payload)
    return resp
  } catch (error) {
    console.error('Error updating chat title:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to update chat title'
    }
  }
}

export async function removeChatClient({
  Session_id,
  user_id
}: {
  Session_id: string
  user_id: string
}) {
  try {
    const payload = {
      action: 'delete_chat',
      user_id: user_id,
      session_id: Session_id,
      deletedBy: 'Test',
      deletedReason: 'Deleted to test API'
    }

    const response = await fetch(`${EDIT_DELETE_CHAT_API}/deletechat`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const resp = await response.json()
    console.log('Deletion successful')
    return resp
  } catch (error) {
    console.error('Error deleting chat:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete chat'
    }
  }
}
