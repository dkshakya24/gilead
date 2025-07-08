'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

import { ServerActionResult, SideBarChat, type Chat } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  IconEdit,
  IconShare,
  IconSpinner,
  IconTrash
} from '@/components/ui/icons'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Input } from './ui/input'
import { Save, X } from 'lucide-react'
import { useWebSocketStore } from '@/lib/store/websocket-store'

interface SidebarActionsProps {
  chat: SideBarChat
  removeChat: (args: {
    Session_id: string
    // path: string
  }) => ServerActionResult<void>
  editChat: (args: {
    Session_id: string
    header_name: string
  }) => ServerActionResult<void>

  // shareChat: (id: string) => ServerActionResult<Chat>
}

export function SidebarActions({
  chat,
  removeChat,
  editChat
  // shareChat
}: SidebarActionsProps) {
  const router = useRouter()
  const { setRefreshChatHistory } = useWebSocketStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  // const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

  const saveEdit = async () => {
    if (editTitle.trim() === '') return

    try {
      await editChat({ Session_id: chat.Session_id, header_name: editTitle })
      setIsEditing(false)
      setEditingId(null)
      setEditTitle('')
      toast.success('Chat title updated', {
        position: 'top-right',
        className: 'bottom-auto top-2'
      })
      // Trigger chat history refresh
      setRefreshChatHistory(true)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update chat title', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    }
  }

  const startEditing = () => {
    setEditingId(chat.Session_id)
    setEditTitle(chat.header_name)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <>
      <div className="flex items-center gap-0 w-full justify-end bg-primary rounded-lg">
        {isEditing ? (
          <div
            className={`flex items-center gap-0 bg-secondary w-full ${isEditing ? 'mt-[0px]' : ''}`}
          >
            <Input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="flex-1 w-3/4 text-white"
              autoFocus
            />
            <Button
              onClick={saveEdit}
              size="sm"
              className="p-1"
              variant="secondary"
            >
              <Save size={16} className="text-white" />
            </Button>
            <Button
              onClick={cancelEdit}
              size="sm"
              className="p-1"
              variant="secondary"
            >
              <X size={16} className="text-white" />
            </Button>
          </div>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-7 p-0 group hover:bg-secondary"
                  onClick={startEditing}
                >
                  <IconEdit className="text-white" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-7 p-0 group hover:bg-secondary"
                  disabled={isRemovePending}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <IconTrash className="text-white" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete chat</TooltipContent>
            </Tooltip>
          </>
        )}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-7 p-0 hover:bg-secondary"
              onClick={() => setShareDialogOpen(true)}
            >
              <IconShare className="text-white" />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share chat</TooltipContent>
        </Tooltip> */}
      </div>
      {/* <ChatShareDialog
        chat={chat}
        shareChat={shareChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopy={() => setShareDialogOpen(false)}
      /> */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your chat message and remove your
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={event => {
                event.preventDefault()
                // @ts-ignore
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    Session_id: chat.Session_id
                    // path: chat.path
                  })

                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }

                  setDeleteDialogOpen(false)
                  toast.success('Chat deleted', {
                    position: 'top-right',
                    className: 'bottom-auto top-2'
                  })
                  // Trigger chat history refresh
                  setRefreshChatHistory(true)
                  router.refresh()
                  router.push('/new')
                  // redirect('/')
                })
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
