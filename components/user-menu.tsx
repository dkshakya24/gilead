import { type Session } from '@/lib/types'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/auth'

export interface UserMenuProps {
  user: Session['user']
}

function getUserInitials(email: string) {
  if (!email) return '??'
  const [firstName, lastName] = email.split('@')[0].split('.')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user?.email) return null

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pl-0">
            <div className="flex size-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
              {getUserInitials(user.email)}
            </div>
            <div className="ml-2 hidden md:flex flex-col items-start dark:text-gray-600">
              <span className="font-semibold text-sm">
                {user.name || user.email.split('@')[0]}
              </span>
              <span className="text-xs text-zinc-500">{user.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-fit">
          <DropdownMenuItem className="flex-col items-start">
            <div className="font-semibold text-sm">
              {user.name || user.email.split('@')[0]}
            </div>
            <div className="text-xs text-zinc-500">{user.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              'use server'
              await signOut()
              window.location.href = '/login'
            }}
          >
            <button className=" relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-secondary hover:text-white focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Sign Out
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
