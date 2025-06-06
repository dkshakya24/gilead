'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <>
      {pathname === '/' || pathname === '/login' ? (
        <>{children}</>
      ) : (
        <>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col flex-1 bg-white">{children}</div>
          </div>
        </>
      )}
    </>
  )
}

export default CustomLayout
