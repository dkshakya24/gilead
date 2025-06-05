import { Sidebar } from '@/components/sidebar'

import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat-history'

export async function SidebarDesktop() {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-primary duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[200px] xl:w-[320px]">
      {/* @ts-ignore */}
      <ChatHistory userId={session.user.email} />
    </Sidebar>
  )
}
