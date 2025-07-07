'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { API_URL, PROJECT_NAME } from '@/lib/utils'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  const session = await auth()

  try {
    const response = await fetch(
      `${API_URL}/get-chat-history?user_id=${session?.user?.email}&session_id=${id}`,
      {
        method: 'GET'
      }
    )
    const resp = await response.json()

    console.log('resp.body', resp)

    return resp

    // return data
    // setNewchatboxId(data.chatter_id)
    // Further processing of data can be done here
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
export async function editChat({
  Session_id,
  header_name
}: {
  Session_id: string
  header_name: string
}) {
  const session = await auth()
  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }
  const payload = {
    action: 'edit_chatname',
    user_id: session?.user?.email,
    session_id: Session_id,
    new_name: header_name
  }
  try {
    const response = await fetch(
      `https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev/editchat`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.ok) {
      console.log('Chat title updated successfully', payload)
    } else {
      throw new Error('Failed to update chat title')
    }
  } catch (error) {
    console.log('Failed to update chat title:', error)
    throw error
  }
}
export async function removeChat({ Session_id }: { Session_id: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }
  const payload = {
    action: 'delete_chat',
    user_id: session?.user?.email,
    session_id: Session_id,
    deletedBy: 'Test',
    deletedReason: 'Deleted to test API'
  }
  try {
    const response = await fetch(
      `https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev/deletechat`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      console.log('Deletion successfull') // Callback for successful deletion (optional)
    } else {
      throw new Error('Deletion failed')
    }
  } catch (error) {
    console.log('Deletion Failed')
  }
}

export async function shareChat(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
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
