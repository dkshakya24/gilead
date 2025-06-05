'use client'

import { SidebarList } from './sidebar-list'
import { Input } from './ui/input'
import * as React from 'react'

const ChatHistoryHeader = ({ userId }: { userId?: string }) => {
  const [search, setSearch] = React.useState('')
  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[#d1214c] hover:bg-[#b91c43] text-white py-3 px-4 rounded-md"
          onClick={() => (window.location.href = '/new')}
        >
          + New Chat
        </button>
        <div className="relative w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList userId={userId} search={search} />
      </React.Suspense>
    </>
  )
}
export default ChatHistoryHeader
