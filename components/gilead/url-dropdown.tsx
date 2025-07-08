'use client'

import * as React from 'react'
import { ChevronDown, Link2, ExternalLink, Copy, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/lib/store/useStore'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type UrlItem = {
  id: string
  title: string
  url: string
}

export function UrlDropdown({ disabled }: { disabled: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const { chatMessages } = useStore()
  const [selectedUrls, setSelectedUrls] = React.useState<string[]>([])
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null)
  const [isUrlEnabled, setIsUrlEnabled] = React.useState(() => {
    // Initialize from localStorage, default to true if not set
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('urlEnabled')
      return stored === null ? true : stored === 'true'
    }
    return true
  })

  // Save to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem('urlEnabled', isUrlEnabled.toString())
  }, [isUrlEnabled])

  // Extract URLs from chat messages
  const extractUrls = React.useMemo(() => {
    if (!isUrlEnabled) return []

    const urlPattern = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g
    const urlMap = new Map<string, UrlItem>()
    let match

    chatMessages.forEach((msg, index) => {
      const content = msg.message
      while ((match = urlPattern.exec(content)) !== null) {
        const url = match[2]
        // Only add if this URL hasn't been seen before
        if (!urlMap.has(url)) {
          urlMap.set(url, {
            id: `url-${index}-${urlMap.size}`,
            title: match[1],
            url: url
          })
        }
      }
    })

    return Array.from(urlMap.values())
  }, [chatMessages, isUrlEnabled])

  const handleUrlClick = (url: string) => {
    window.open(url, '_blank')
  }

  const handleCheckbox = (id: string) => {
    setSelectedUrls(prev =>
      prev.includes(id) ? prev.filter(urlId => urlId !== id) : [...prev, id]
    )
  }

  const handleCopy = async (url: string) => {
    await copyToClipboard(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  // Function to truncate URL
  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    const start = url.substring(0, maxLength / 2)
    const end = url.substring(url.length - maxLength / 2)
    return `${start}...${end}`
  }

  return (
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled}
          className={`flex h-[38px] gap-x-2 items-center px-3 rounded-3xl py-2 border text-sm
            ${
              disabled || !isUrlEnabled
                ? 'opacity-50 cursor-not-allowed border-gray-200'
                : 'cursor-pointer bg-white border-gray-200'
            }`}
        >
          <span>URL ({isUrlEnabled ? extractUrls.length : 0})</span>
          <ChevronDown
            className={`transition-transform duration-200 w-4 h-4 ${
              !disabled && isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </DropdownMenuTrigger>

      {!disabled && (
        <DropdownMenuContent className="w-[400px] p-3 rounded-xl">
          <div className="p-0">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="url-toggle" className="text-sm text-gray-700">
                Enable URL Tracking
              </Label>
              <Switch
                id="url-toggle"
                checked={isUrlEnabled}
                onCheckedChange={setIsUrlEnabled}
              />
            </div>
            <Separator className="my-2" />
            {isUrlEnabled ? (
              extractUrls.length > 0 ? (
                <div
                  className={`${extractUrls.length > 5 ? 'max-h-[300px] overflow-y-auto' : ''}`}
                >
                  {extractUrls.map((url, index) => (
                    <div
                      key={url.id}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 ${
                        extractUrls.length === index + 1
                          ? ''
                          : 'border-b-2 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedUrls.includes(url.id)}
                          onChange={() => handleCheckbox(url.id)}
                          className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{url.title}</div>
                        <div className="text-xs text-gray-500 truncate flex items-center gap-2">
                          <span className="truncate">
                            {truncateUrl(url.url)}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleCopy(url.url)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  {copiedUrl === url.url ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3 text-gray-400" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {copiedUrl === url.url ? 'Copied!' : 'Copy URL'}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleUrlClick(url.url)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <ExternalLink className="h-3 w-3 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Open in new tab</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No URLs in current session
                </div>
              )
            ) : (
              <div className="text-center py-4 text-gray-500">
                URL tracking is disabled
              </div>
            )}
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
