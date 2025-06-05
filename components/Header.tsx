import * as React from 'react'
import Link from 'next/link'

import { MdInsights } from 'react-icons/md'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import logo from '@/public/merck1.png'
import Image from 'next/image'
import logoicon from '@/public/aivy-icon.png'
// import SourceMultiSelect from './source-multi-select'
import {
  PiHouseLineDuotone,
  PiChatCircleDotsDuotone,
  PiDatabaseDuotone
} from 'react-icons/pi'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user?.email ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.email} />
          </SidebarMobile>
        </>
      ) : (
        <Link
          href="/new"
          rel="nofollow"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            className="hidden size-6 mr-2 dark:block"
            src={logoicon}
            alt="icon"
          />
          <Image
            className="size-6 mr-2 dark:hidden"
            src={logoicon}
            alt="icon"
          />
        </Link>
      )}
      <div className="flex items-center">
        {session?.user?.email ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <IconSeparator className="size-6 text-muted-foreground/50" />
            <Button
              variant="link"
              asChild
              className="-ml-2 hover:text-primary transition-colors"
            >
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md w-full h-16 px-6 border-b border-gray-100 dark:bg-white/80 shadow-sm">
      <div className="flex items-center justify-between gap-3 mr-3">
        <SidebarToggle />
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src={logo}
            alt="AIVY"
            className="max-w-[150px] max-h-[90px]"
          />
        </Link>
      </div>
      <div className="flex items-center justify-between gap-6">
        <nav className="hidden md:flex items-center space-x-4">
          {/* <Link
            href="/"
            className="group text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
          >
            <PiHouseLineDuotone className="text-lg mr-2 group-hover:text-primary" />
            Home
          </Link> */}
          {/* <Link
            href="/askeugene"
            className="group text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
          >
            <PiDatabaseDuotone className="text-lg mr-2 group-hover:text-primary" />
            Ask Eugene
          </Link> */}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
