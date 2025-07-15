'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { API_URL, EDIT_DELETE_CHAT_API, PROJECT_NAME } from '@/lib/utils'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    // Fetch chats from your API instead of KV store
    const response = await fetch(
      `${API_URL}/get-chat-history?user_id=${userId}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch chats')
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function shareChat(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    // Fetch chat from API
    const response = await fetch(
      `${API_URL}/get-chat-history?user_id=${session.user.email}&session_id=${id}`,
      {
        method: 'GET'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch chat')
    }

    const chat = await response.json()

    if (!chat || chat.user_id !== session.user.email) {
      return {
        error: 'Something went wrong'
      }
    }

    const payload = {
      ...chat,
      sharePath: `/share/${chat.session_id}`
    }

    return payload
  } catch (error) {
    console.error('Error sharing chat:', error)
    return {
      error: 'Something went wrong'
    }
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getChatId() {
  try {
    const response = await fetch(`${API_URL}/add_chatter_box`, {
      method: 'POST'
    })
    const data = await response.json()
    return data
    // setNewchatboxId(data.chatter_id)
    // Further processing of data can be done here
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
