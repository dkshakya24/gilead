import { auth } from '@/auth'
import { Header } from '@/components/Header'
interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = await auth()
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden w-full">
        {children}
      </div>
    </>
  )
}
