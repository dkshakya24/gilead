import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Chat } from '@/components/chat'
import { Session } from '@/lib/types'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()
  
  if (!session) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  return <Chat id={params.id} initialMessages={null} session={session} />
}
