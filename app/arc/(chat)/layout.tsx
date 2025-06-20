import { auth } from '@/auth'
import SidebarGilead from '@/components/gilead/sidebar-gilead'
import { Header } from '@/components/Header'
import { SidebarDesktop } from '@/components/sidebar-desktop'
import SourceMultiSelect from '@/components/source-multi-select'
import { Session } from '@/lib/types'
interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = await auth()
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden w-full">
        <SidebarGilead session={session as Session} />
        {/* <div className="absolute top-2 right-2 z-50 ">
          <SourceMultiSelect />
        </div> */}
        {children}
      </div>
    </>
  )
}
