'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { Button } from '@/components/ui/button'
import { IconSidebar } from '@/components/ui/icons'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import {
  ArrowLeftIcon,
  ArrowRight,
  LucideSidebar,
  SidebarClose,
  SidebarIcon
} from 'lucide-react'

export function SidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useSidebar()

  return (
    <>
      {isSidebarOpen ? (
        <Button
          variant="ghost"
          className="-ml-2 hidden size-9 p-0 lg:flex"
          onClick={() => {
            toggleSidebar()
          }}
        >
          <LucideSidebar className="size-6 dark:text-gray-600 rotate-180" />

          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      ) : null}
    </>
  )
}
