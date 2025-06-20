import { auth } from '@/auth'
import { Header } from '@/components/Header'
import SidebarDesktopContainer from '@/components/sidebar-desktop'
import SidebarDesktop from '@/components/sidebar-desktop'
import SourceMultiSelect from '@/components/source-multi-select'
import { Session } from '@/lib/types'
interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = (await auth()) as Session
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <SidebarDesktopContainer session={session} />
        {/* <div className="absolute top-2 right-2 z-50 ">
          <SourceMultiSelect />
        </div> */}
        {children}
      </div>
    </>
  )
}
