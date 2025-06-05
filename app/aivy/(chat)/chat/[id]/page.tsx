// 'use client'

import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Chat } from '@/components/chat'
import { Session } from '@/lib/types'
import { getChat } from '@/app/actions'
// import { UIState } from '@/lib/chat/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}

// export async function generateMetadata({
//   params
// }: ChatPageProps): Promise<Metadata> {
//   const session = await auth()

//   if (!session?.user) {
//     return {}
//   }

//   const chat = await getChat(params.id, session.user.id)
//   return {
//     title: chat?.title.toString().slice(0, 50) ?? 'Chat'
//   }
// }

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  if (!session) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  // const userId = session.user.id as string
  const chat = await getChat(params.id)

  //   if (!chat) {
  //     redirect('/')
  //   }

  //   if (chat?.userId !== session?.user?.id) {
  //     notFound()
  //   }
  console.log(chat, 'chatchatchat')

  return <Chat session={session} id={params.id} initialMessages={chat} />
}
