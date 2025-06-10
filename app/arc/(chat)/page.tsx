import { Chat } from '@/components/chat'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'
// import { createNewChat, getChatId } from '../actions'
import dynamic from 'next/dynamic'

const ToastOnLoad = dynamic(() => import('@/components/toast-onload'), {
  ssr: false
})
export const metadata = {
  title: 'Welcome to GABI ARC'
}

export default async function IndexPage() {
  // const id = await getChatId()
  const session = (await auth()) as Session
  if (!session) {
    redirect('/login')
  }
  console.log(session, 'session122')

  return (
    <>
      {/* <ToastOnLoad /> */}
      <Chat session={session} />
    </>
  )
}
