'use client'

import {
  DrawerSheet,
  DrawerSheetContent,
  DrawerSheetTrigger
} from '@/components/ui/right-drawer'

import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'

interface SidebarSourcesProps {
  children: React.ReactNode
  sourceCall: () => void
}

export function SourcesDrawer({ children, sourceCall }: SidebarSourcesProps) {
  return (
    <DrawerSheet>
      <DrawerSheetTrigger asChild>
        <Button
          variant="outline"
          className="text-secondary border-secondary hover:text-secondary"
          onClick={() => {
            sourceCall()
          }}
        >
          Citations
        </Button>
      </DrawerSheetTrigger>
      <DrawerSheetContent
        side="right"
        className="inset-y-0 flex h-auto sm:max-w-[700px] lg:max-w-[700px] w-full flex-col p-0"
      >
        {children}
      </DrawerSheetContent>
    </DrawerSheet>
  )
}
