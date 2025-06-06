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
import logo from '@/public/GileadLogo.svg'
import Image from 'next/image'
import logoicon from '@/public/GileadLogo.svg'
// import SourceMultiSelect from './source-multi-select'
import {
  PiHouseLineDuotone,
  PiChatCircleDotsDuotone,
  PiDatabaseDuotone
} from 'react-icons/pi'
import { Bell } from 'lucide-react'
import ExportDropdown from './gilead/export-dropdwon'
import { KeywordsDropdown } from './gilead/keywords-dropdown'
import { UrlDropdown } from './gilead/url-dropdown'
import ReasoningFactor from './gilead/reasoning-factor'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user?.email ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session?.user?.email} />
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

export async function Header() {
  const session = (await auth()) as Session
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md w-full h-16 px-6 border-b border-gray-100 dark:bg-white/80 shadow-sm">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src={logo}
            alt="Gilead"
            className="max-w-[150px] max-h-[90px]"
          />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4 flex-1 md:gap-6">
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
          <ReasoningFactor disabled />
          <UrlDropdown disabled />
          <KeywordsDropdown disabled />
          <ExportDropdown disabled={false} session={session} />
          <button className="flex items-center cursor-not-allowed opacity-50 justify-center w-[38px] h-[38px] bg-white border border-gray-200 rounded-full">
            <Bell className="h-4 w-4" />
          </button>
        </nav>
        <div className="flex items-center">
          <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
            <UserOrLogin />
          </React.Suspense>
        </div>
      </div>
    </header>
  )
}
