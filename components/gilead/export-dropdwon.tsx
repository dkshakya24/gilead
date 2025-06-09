'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Download,
  ArrowRight,
  FileText,
  FileCheck,
  FileBarChart2,
  Mail,
  Loader2
} from 'lucide-react'
import { Session } from '@/lib/types'
import { usePathname, useSearchParams } from 'next/navigation'
import { useWebSocketStore } from '@/lib/store/websocket-store'

export default function ExportDropdown({
  disabled,
  session
}: {
  disabled: boolean
  session: Session
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [DOCX, setDOCX] = useState('')
  const [PPT, setPPT] = useState('')
  const [DOCXName, setDOCXName] = useState('')
  const [PPTName, setPPTName] = useState('')
  const [isChatDownloaded, setIsChatDownloaded] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const sessionId = pathname.split('/').pop()
  const isStreaming = useWebSocketStore(state => state.isStreaming)

  const payload = useMemo(
    () => ({
      headers: {
        'User-Id': `${session?.user?.email}`
      },
      body: {
        session_id: sessionId
      }
    }),
    [session?.user?.email, sessionId]
  )

  const fetchChatFiles = useCallback(async () => {
    if (!pathname.includes('chat')) return

    try {
      setIsChatDownloaded(false)
      const response = await fetch(
        `https://g6dy9f8dr4.execute-api.us-east-1.amazonaws.com/dev/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )
      const data = await response.json()

      if (response.ok && data.statusCode === 200) {
        setDOCX(data?.body?.docx.file)
        setPPT(data?.body?.pptx.file)
        setDOCXName(data?.body?.docx.fileName)
        setPPTName(data?.body?.pptx.fileName)
        setIsChatDownloaded(true)
        console.log('downloaded')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsChatDownloaded(true)
    }
  }, [payload, pathname])

  useEffect(() => {
    if (pathname.includes('chat') && !isStreaming) {
      fetchChatFiles()
    }
  }, [isStreaming, pathname])

  const downloadPPTFile = useCallback(() => {
    try {
      const mimeType =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      const base64 = `data:${mimeType};base64,${PPT}`
      const data = base64.startsWith('data:') ? base64.split(',')[1] : base64
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = PPTName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download presentation:', error)
    }
  }, [PPT, PPTName])

  const downloadDocxFile = useCallback(() => {
    try {
      const mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      if (!DOCX) {
        throw new Error('No document data provided.')
      }

      const base64 = `data:${mimeType};base64,${DOCX}`
      const data = base64.startsWith('data:') ? base64.split(',')[1] : base64
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = DOCXName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download document:', error)
    }
  }, [DOCX, DOCXName])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (!disabled) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [disabled])

  const exportOptions = useMemo(
    () => [
      {
        label: 'Word',
        icon: <FileText className="h-5 w-5 text-blue-600" />,
        onClick: downloadDocxFile,
        disabled: false
      },
      {
        label: 'PPT',
        icon: <FileBarChart2 className="h-5 w-5 text-orange-500" />,
        onClick: downloadPPTFile,
        disabled: false
      },
      {
        label: 'PDF',
        icon: <FileCheck className="h-5 w-5 text-[#C5203F]" />,
        disabled: true
      },
      {
        label: 'Mail',
        icon: <Mail className="h-5 w-5 text-[#C5203F]" />,
        disabled: true
      }
    ],
    [downloadDocxFile, downloadPPTFile]
  )

  return (
    <div className="flex gap-4">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            if (isChatDownloaded && pathname.includes('chat'))
              setIsOpen(prev => !prev)
          }}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`flex h-[38px] items-center gap-x-2 px-3 py-2 rounded-3xl border text-sm transition
            ${
              isChatDownloaded && pathname.includes('chat')
                ? 'bg-white border-gray-200 text-black cursor-pointer'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          Export
          {!isChatDownloaded && pathname.includes('chat') ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </button>

        {isOpen && !disabled && (
          <div className="absolute right-0 mt-1 w-60 p-2 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 ring-opacity-5 z-[999]">
            <div className="py-1">
              {exportOptions.map((option, index) => (
                <button
                  key={option.label}
                  disabled={option.disabled}
                  onClick={option.onClick}
                  className={`flex w-full ${
                    exportOptions.length === index + 1
                      ? ''
                      : 'border-b border-gray-200'
                  } items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 ${
                    option.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
