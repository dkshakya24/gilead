import { Header } from '@/components/Header'
import { SidebarDesktop } from '@/components/sidebar-desktop'
import SourceMultiSelect from '@/components/source-multi-select'
interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <SidebarDesktop />
        {/* <div className="absolute top-2 right-2 z-50 ">
          <SourceMultiSelect />
        </div> */}
        {children}
      </div>
    </>
  )
}
