'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { API_URL ,PROJECT_NAME} from '@/lib/utils'

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
  const payload = {
    body: {
      chatter_id: id
    },
    headers: {
      'User-Id': session?.user?.email || ''
    }
  }

  try {
    const response = await fetch(`${API_URL}/${PROJECT_NAME}_getallchatdetails`, {
      method: 'POST',
      body: JSON.stringify(payload) // Convert the payload object to a JSON string
    })
    const resp = await response.json()
    const data = resp.body
    console.log('resp.body', data)

    return data

    // return data
    // setNewchatboxId(data.chatter_id)
    // Further processing of data can be done here
  } catch (error) {
    console.error('Error fetching data:', error)
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
    headers: {
      'User-Id': session?.user?.email || ''
    },
    body: {
      chatter_id: Session_id
    }
  }
  try {
    const response = await fetch(`${API_URL}/${PROJECT_NAME}_delete`, {
      method: 'POST',

      body: JSON.stringify(payload)
    })

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
