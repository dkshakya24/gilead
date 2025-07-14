import { API_URL } from '@/lib/utils'

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
