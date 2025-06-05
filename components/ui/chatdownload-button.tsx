'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'
import { IoDownloadOutline } from 'react-icons/io5'
import { toast } from 'sonner'
import { PiFilePptFill } from 'react-icons/pi'
import { TbFileTypeDocx } from 'react-icons/tb'
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
import { FaFilePdf } from 'react-icons/fa6'
export function DownloadChat({
  isStreaming,
  session,
  chatterid,
  chatMessages
}: {
  isStreaming?: boolean
  session?: any
  chatterid?: string
  chatMessages?: any
}) {
  const pathname = usePathname()
  const [isBtnClicked, setIsBtnClicked] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [loader, setLoader] = React.useState(false)
  const [formState, setFormState] = React.useState({
    slide_count: '',
    target_audience: '',
    focus_areas: '',
    presentation_goal: '',
    additional_comments: '',
    executive_summary: false,
    parameter: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Parse the response JSON
      const data = await response.json()
      // downloadPDFFile(data.pdf, data?.filename)
      setFormState({
        slide_count: '',
        target_audience: '',
        focus_areas: '',
        presentation_goal: '',
        additional_comments: '',
        executive_summary: false,
        parameter: false
      })
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
    try {
      const response = await fetch(`${PPT_GENERATE_API}`, {
        method: 'POST',
        headers: {
          'User-Id': session?.user?.email,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatter_id: chatterid,
          slide_count: formState.slide_count,
          target_audience: formState.target_audience,
          focus_areas: formState.focus_areas,
          presentation_goal: formState.presentation_goal,
          additional_comments: formState.additional_comments,
          has_executive_summary_slide: formState.executive_summary,
          has_agenda_slide: formState.parameter
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
          'User-Id': session?.user?.email,
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
    <div className="flex">
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              size="icon"
              variant={'secondary'}
              className="rounded-full text-lg"
              onClick={() => {
                setIsBtnClicked(!isBtnClicked) // Toggle isChatDownloaded state
              }}
              // disabled={isStreaming || !isChatDownloaded ? true : false}
              disabled={isStreaming ? true : false}
            >
              <IoDownloadOutline className="text-white" />
              <span className="sr-only">Download Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export Analysis</TooltipContent>
        </Tooltip>
        {isBtnClicked ? (
          <div className="flex absolute flex-col gap-2">
            <Button
              type="submit"
              size="icon"
              variant={'secondary'}
              className="rounded-full text-lg mt-2"
              onClick={() => handleDocxFile()}
              disabled={isStreaming ? true : false}
            >
              <TbFileTypeDocx className="text-white" />
              <span className="sr-only">Download Chat</span>
            </Button>
            {/* <Button
              type="submit"
              size="icon"
              variant={'secondary'}
              className="rounded-full text-lg"
              onClick={openModal}
              disabled={isStreaming ? true : false}
            >
              <PiFilePptFill className="text-white" />

              <span className="sr-only">Download Chat</span>
            </Button> */}
          </div>
        ) : null}
        <CustomModal isModalOpen={isModalOpen} closeModal={closeModal}>
          <div className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
            <div className="flex relative justify-center mb-6 items-center">
              <p className="text-lg font-semibold text-gray-800">
                Additional Information
              </p>
              <button
                onClick={closeModal}
                className="text-gray-400 absolute left-[334px] hover:text-gray-700 transition ml-[100px]"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="hidden"
              placeholder="Enter detailed information"
            />
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label
                    htmlFor="slide_count"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Slide Count (Should be 5+)
                  </label>
                  <input
                    type="text"
                    id="slide_count"
                    name="slide_count"
                    value={formState.slide_count}
                    onChange={handleChange}
                    // min="5"
                    // max="20"
                    // onKeyDown={e => {
                    //   if (
                    //     !/[0-9]/.test(e.key) &&
                    //     e.key !== 'Backspace' &&
                    //     e.key !== 'Delete' &&
                    //     e.key !== 'ArrowLeft' &&
                    //     e.key !== 'ArrowRight'
                    //   ) {
                    //     e.preventDefault()
                    //   }
                    // }}
                    className="mt-1 block w-full h-10 p-2 focus:border-blue-400 focus:ring-blue-200 rounded-md border-[1px] border-gray-300 shadow-sm outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="target_audience"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Target Audience Persona
                  </label>
                  <input
                    type="text"
                    id="target_audience"
                    name="target_audience"
                    value={formState.target_audience}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 p-2 focus:border-blue-400 focus:ring-blue-200 rounded-md border-[1px] border-gray-300 shadow-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label
                    htmlFor="focus_areas"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Presentation Focus Areas
                  </label>
                  <input
                    type="text"
                    id="focus_areas"
                    name="focus_areas"
                    value={formState.focus_areas}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 p-2 focus:border-blue-400 focus:ring-blue-200 rounded-md border-[1px] border-gray-300 shadow-sm outline-none"
                  />
                </div>

                <div className="w-1/2">
                  <label
                    htmlFor="presentation_goal"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Presentation Goal
                  </label>
                  <input
                    type="text"
                    id="presentation_goal"
                    name="presentation_goal"
                    value={formState.presentation_goal}
                    onChange={handleChange}
                    className="mt-1 block w-full h-10 p-2 focus:border-blue-400 focus:ring-blue-200 rounded-md border-[1px] border-gray-300 shadow-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-x-10 mt-2">
                <div className="flex items-center w-1/2">
                  <input
                    type="checkbox"
                    id="executive_summary"
                    name="executive_summary"
                    checked={formState.executive_summary}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="executive_summary"
                    className="ml-2 block text-sm text-gray-600 cursor-pointer"
                  >
                    Executive Summary
                  </label>
                </div>
                <div className="flex items-center w-1/2">
                  <input
                    type="checkbox"
                    id="parameter"
                    name="parameter"
                    checked={formState.parameter}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="parameter"
                    className="ml-2 block text-sm text-gray-600 cursor-pointer"
                  >
                    Agenda
                  </label>
                </div>
              </div>
              <div>
                <label
                  htmlFor="additional_comments"
                  className="block text-sm font-medium text-gray-600"
                >
                  Additional Comments
                </label>
                <input
                  type="text"
                  id="additional_comments"
                  name="additional_comments"
                  value={formState.additional_comments}
                  onChange={handleChange}
                  className="mt-1 block w-full h-20 p-2 focus:border-blue-400 focus:ring-blue-200 rounded-md border-[1px] border-gray-300 shadow-sm outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-4 w-full mt-6">
              <Button
                variant="secondary"
                className="text-white"
                onClick={handleSubmit}
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
