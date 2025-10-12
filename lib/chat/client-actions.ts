import { API_URL, EDIT_DELETE_CHAT_API } from '@/lib/utils'

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
