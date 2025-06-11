'use client'

import * as React from 'react'
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
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IoDownloadOutline } from 'react-icons/io5'
import { toast } from 'sonner'

import {
  API_URL,
  PROJECT_NAME,
  PPT_GENERATE_API,
  PPT_DOWNLOAD_API
} from '@/lib/utils'
import CustomModal from '@/components/ui/CustomModal'
import { AiOutlineClose } from 'react-icons/ai' // Using React Icons for the close icon
import { SpinnerMessage } from '@/components/aivy-message/message'
import { spinner } from '@/components/aivy-message/spinner'
import { AiOutlineLoading3Quarters } from 'react-icons/ai' // Import a spinning loader icon
import { TbLoader } from 'react-icons/tb'
import DraggableQuestions from '@/components/gilead/draggableQuestions'
import { Info } from 'lucide-react'

interface Question {
  id: string
  text: string
  checked: boolean
  chatId: string
}

export function DownloadChat({
  isStreaming,
  session,
  chatterid,
  chatMessages,
  newMessageId
}: {
  isStreaming?: boolean
  session?: any
  chatterid?: string
  chatMessages?: any
  newMessageId: any
}) {
  const pathname = usePathname()
  const [isBtnClicked, setIsBtnClicked] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [loader, setLoader] = React.useState(false)
  const [questions, setQuestions] = useState<any>([])
  const [selectedValue, setSelectedValue] = useState('Senior Leadership')
  const [customInput, setCustomInput] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const options = [
    'Workshop',
    'Country Discussion',
    'Senior Leadership',
    'Cross-functional Meeting',
    'Internal Meeting',
    'Custom'
  ]

  const getQuestionChatId = (question: string) => {
    const result: any = questions.find((item: any) => item.message === question)
    return result.chatId
  }

  function processChatMessages(
    chatMessages: { sender: string; message: string; chatId?: string }[],
    newMessageId: string
  ): { message: string; chatId: string }[] {
    return chatMessages
      .map((msg, index, arr) => {
        if (msg.sender === 'user') {
          // Look ahead for the next bot message with a chatId
          const nextBotMessage = arr
            .slice(index + 1)
            .find(m => m.sender !== 'user' && m.chatId)

          return {
            id: (index + 1).toString(),
            message: msg.message,
            chatId: nextBotMessage ? nextBotMessage.chatId! : newMessageId,
            checked: false
          }
        }
        return null
      })
      .filter(Boolean) as { message: string; chatId: string }[]
  }

  React.useEffect(() => {
    const res = processChatMessages(chatMessages, newMessageId)
    setQuestions(res)
  }, [chatMessages, newMessageId])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  console.log(process.env, '.env')

  const downloadPPTFile = (PPT?: string, fileName?: string) => {
    try {
      // MIME type for .pptx files
      const mimeType =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'

      const base64 = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${PPT}`
      // Extract base64 data if it includes a MIME type prefix
      const data = base64.startsWith('data:') ? base64.split(',')[1] : base64

      // Decode base64 string
      const byteCharacters = atob(data)

      // Convert byte characters to byte numbers
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: mimeType })

      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName ?? '' // Default file name for .pptx

      // Append the link to the body, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('File downloaded successfully', {
        position: 'top-center',
        className: 'top-[-15px]',
        duration: 1000
      })
    } catch (error) {
      console.error('Failed to download presentation:', error)
    }
  }

  const downloadDocxFile = (DOCX?: string, fileName?: string) => {
    try {
      // Base64 string without the Data URI prefix
      const mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      // Check if DOCX is defined and not empty
      if (!DOCX) {
        throw new Error('No document data provided.')
      }
      const base64 = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${DOCX}`
      // Extract the base64 data part if it includes a MIME type prefix
      const data = base64.startsWith('data:') ? base64.split(',')[1] : base64

      // Decode the base64 string
      const byteCharacters = atob(data)

      // Convert byte characters to byte numbers
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: mimeType })
      console.log(byteArray, 'dkshakya')

      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName ?? '' // Default file name for .docx
      console.log(link.href, blob, 'dkshakya1')

      // Append the link to the body, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('File downloaded successfully', {
        position: 'top-center',
        className: 'top-[-15px]',
        duration: 1000
      })
    } catch (error) {
      console.error('Failed to download document:', error)
    }
  }

  const handleFileDownload = async (id: string) => {
    setIsBtnClicked(false)
    setLoader(true)
    const toastId = toast.success('Downloading Your File...', {
      position: 'top-center',
      className: 'top-[-15px]',
      duration: 9000,
      action: (
        <Button
          variant={'secondary'}
          onClick={() => {
            toast.dismiss(toastId)
          }}
          className="text-xs p-0 text-white w-[50px] h-[22px] ml-[154px]"
        >
          Close
        </Button>
      ),
      icon: <TbLoader className="animate-spin text-secondary w-4 h-4" />
    })
    try {
      const response = await fetch(`${PPT_DOWNLOAD_API}/?presentation_id=${id}`)

      // Check if the response status is OK (status code 200Ã¢â‚¬â€œ299)
      https: if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Parse the response JSON
      const data = await response.json()
      // downloadPDFFile(data.pdf, data?.filename)
      setSelectedValue('Senior Leadership')
      setCustomInput('')
      setQuestions(questions.map((item: any) => ({ ...item, checked: false })))
      setLoader(false)
      downloadPPTFile(data.pptx_base64, data?.presentation_name)
      if (data) {
        toast.dismiss(toastId)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoader(false)
      throw error // Re-throw the error for further handling if needed
    }
    setLoader(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    closeModal()
    setIsBtnClicked(false)
    setLoading(true)
    const toastId = toast.success('Preparing Your File...', {
      position: 'top-center',
      className: 'top-[-15px] justify-around',
      duration: 300000, // 5 minutes
      action: (
        <Button
          variant={'secondary'}
          onClick={() => {
            toast.dismiss(toastId)
          }}
          className="text-xs p-0 text-white w-[50px] h-[22px] ml-[60px]"
        >
          Close
        </Button>
      ),
      icon: <TbLoader className="animate-spin text-secondary w-4 h-4" />
    })
    console.log(PPT_GENERATE_API, PPT_DOWNLOAD_API, 'PPT_GENERATE_API')
    // const response = await fetch(`${PPT_GENERATE_API}`, {
    try {
      const response = await fetch(`${PPT_GENERATE_API}`, {
        method: 'POST',
        headers: {
          'User-Id': session.user.email,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatter_id: chatterid,
          presentation_purpose:
            selectedValue === 'Custom' ? customInput : selectedValue,
          selected_questions: questions
            .filter((item: any) => item.checked)
            .map((data: any) => getQuestionChatId(data.message))
        })
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      handleFileDownload(data.presentation_id)
      if (data) {
        toast.dismiss(toastId)
        console.log('data is here')
      }
    } catch (error) {
      console.error('Error during API call:', error)
    }
    setLoading(false)
    // setInputValue('')
  }

  const handleDocxFile = async () => {
    const toastId2 = toast.success('We are preparing your download - DOCX', {
      position: 'top-center',
      className: 'top-[-15px] justify-around',
      duration: 300000, // 5 minutes
      action: (
        <Button
          variant={'secondary'}
          onClick={() => {
            toast.dismiss(toastId2)
          }}
          className="text-xs p-0 text-white w-[50px] h-[22px]"
        >
          Close
        </Button>
      ),
      icon: <TbLoader className="animate-spin text-secondary w-4 h-4" />
    })
    setIsBtnClicked(false)
    const payload = {
      headers: {
        'User-Id': `${session.user.email}`
      },
      body: {
        chatter_id: chatterid
      }
    }
    try {
      const response = await fetch(`${API_URL}/${PROJECT_NAME}_download`, {
        method: 'POST',
        headers: {
          'User-Id': session.user.email,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      downloadDocxFile(data.body.docx.file, data?.body.docx.fileName)
      if (data) {
        toast.dismiss(toastId2)
        console.log('docx download data is here')
      }
    } catch (error) {
      console.error('Error during API call:', error)
    }
    setLoading(false)
    setInputValue('')
  }

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

        <CustomModal isModalOpen={isModalOpen} closeModal={closeModal}>
          <div className="w-[600px] p-6 bg-white rounded-lg shadow-lg">
            <div className="flex relative justify-center items-center mb-2">
              <p className="text-lg font-semibold text-gray-800">
                Export to PowerPoint
              </p>
              <button
                onClick={closeModal}
                className="text-gray-400 absolute left-[412px] hover:text-gray-700 transition ml-[100px]"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Presentation Purpose */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  1. Select Presentation Purpose
                </label>
                <div className="flex flex-col gap-2">
                  <select
                    className="border p-2 rounded outline-none"
                    value={selectedValue}
                    onChange={e => setSelectedValue(e.target.value)}
                  >
                    {options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {selectedValue === 'Custom' && (
                    <input
                      type="text"
                      className="border p-2 rounded outline-none"
                      placeholder="Your input here"
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                    />
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                  {/* Info Icon at the Top */}
                  <div className="flex items-center gap-2 text-gray-600 pb-2">
                    <Info size={16} />
                  </div>

                  {/* Conditional Content */}
                  <div className="italic">
                    {selectedValue === 'Senior Leadership'
                      ? 'For Senior Leadership, the presentation will focus on high-level insights, business implications, and actionable recommendations.'
                      : selectedValue === 'Workshop'
                        ? 'For Workshops, the presentation will include insights summaries, discussion starters, and interactive elements like polls.'
                        : selectedValue === 'Country Discussion'
                          ? 'For Country Discussions, insights will be segmented by country, with comparative analysis of key differences.'
                          : selectedValue === 'Cross-functional Meeting'
                            ? 'For Cross-functional Meetings, insights will be categorized by functional areas such as Commercial, Medical, Access, and Pricing.'
                            : selectedValue === 'Internal Meeting'
                              ? 'For Internal Meetings, the presentation will provide a detailed breakdown of KBQs, data sources, and supporting evidence.'
                              : selectedValue === 'Custom'
                                ? 'For Custom presentations, you can manually define the structure and content as needed.'
                                : ''}
                    <div className="font-medium">
                      Agenda and Executive summary slides included
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Questions */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    2. Select Questions to Include
                  </label>
                  <p className="text-xs text-gray-500">
                    Drag and reorder the questions as needed.
                  </p>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-auto">
                  <DraggableQuestions
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-4 w-full mt-2">
              <Button
                variant="secondary"
                className="text-white"
                onClick={handleSubmit}
                disabled={
                  (selectedValue === 'Custom'
                    ? customInput === ''
                      ? true
                      : false
                    : false) ||
                  (questions.filter((item: any) => item.checked).length > 0
                    ? false
                    : true)
                }
              >
                <span>
                  {loading ? (
                    <AiOutlineLoading3Quarters
                      className="animate-spin mr-2"
                      size={18}
                    />
                  ) : null}
                </span>
                Submit
              </Button>
            </div>
          </div>
        </CustomModal>
      </div>
    </div>
  )
}
