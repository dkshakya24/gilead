'use client'

import { Button } from '@/components/ui/button'
import { FEEDBACK_API } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from '../ui/icons'

const FeedbackComponent = ({
  setIsFeedbackClicked,
  chatId,
  selectedText,
  startOffset,
  endOffset,
  session,
  selectSpanElement,
  revertSelection
}: {
  setIsFeedbackClicked: (value: boolean) => void
  chatId?: string
  selectedText: string
  startOffset: number
  endOffset: number
  session?: any
  selectSpanElement: HTMLSpanElement | null
  revertSelection: (span: HTMLSpanElement, originalText: string) => void
}) => {
  const [rating, setRating] = useState('')
  const [copiedText] = useState(selectedText)
  const [feedback, setFeedback] = useState('')
  const [responseIdd, setResponseIdd] = useState('')
  const [isFeedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const feedbackRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  useEffect(() => {
    const pathParts = pathname.split('/')
    const responseIdFromPath = pathParts[pathParts.length - 1]
    setResponseIdd(responseIdFromPath)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        feedbackRef.current &&
        !feedbackRef.current.contains(event.target as Node)
      ) {
        setIsFeedbackClicked(false)
        if (selectSpanElement) {
          revertSelection(selectSpanElement, selectedText)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsFeedbackClicked])

  const handleRatingChange = (e: any) => {
    setRating(e.target.value)
  }

  const handleFeedbackChange = (e: any) => {
    setFeedback(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const payload = {
      questionId: chatId,
      responseId: chatId,
      startOffset: startOffset,
      endOffset: endOffset,
      text: copiedText,
      image: '', // Optional
      category: rating,
      comment: feedback
    }
    // Handle the form submission logic here

    setFeedbackSubmitted(true)
    try {
      const response = await fetch(
        `${FEEDBACK_API}/conversations/${responseIdd}/annotations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            user: `{"id":"${session.user.email}"}`
          },
          body: JSON.stringify(payload)
        }
      )
      const data = await response.json()

      if (response.ok) {
        setIsFeedbackClicked(false)
        setFeedbackSubmitted(false) // Close feedback form on successful submission
        toast.success('Feedback Captured Successfully! Thanks', {
          position: 'top-right',
          className: 'bottom-auto'
        })
      } else {
        if (data.errorMessage) {
          const errorMsg = data.errorMessage
            .map((error: any) => error.msg)
            .join(', ')
          toast.error(`Error: ${errorMsg}`, {
            position: 'top-right',
            className: 'bottom-auto'
          })
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('An unexpected error occurred. Please try again later.', {
        position: 'top-right',
        className: 'bottom-auto'
      })
    }

    if (selectSpanElement) {
      revertSelection(selectSpanElement, copiedText)
    }
    setFeedbackSubmitted(false)
  }

  const handleCancel = () => {
    setIsFeedbackClicked(false)
    if (selectSpanElement) {
      revertSelection(selectSpanElement, copiedText)
    }
  }

  return (
    <div
      ref={feedbackRef}
      className="fixed z-[999] bottom-0 right-0 w-full md:w-auto md:max-w-md md:bottom-24 md:right-4 p-4 border border-gray-300 bg-white rounded-t-lg md:rounded-lg shadow-lg"
    >
      <button
        onClick={handleCancel}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close feedback"
      >
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
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <h2 className="text-lg font-semibold mb-4 text-primary pr-8">
        Please share your feedback here!
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <label className="mb-2 text-sm text-gray-500 items-center flex">
            <input
              type="radio"
              value="Incorrect"
              checked={rating === 'Incorrect'}
              onChange={handleRatingChange}
              className="mr-1"
            />
            Incorrect
          </label>
          <label className="mb-2 text-sm text-gray-500 items-center flex">
            <input
              type="radio"
              value="Irrelevant"
              checked={rating === 'Irrelevant'}
              onChange={handleRatingChange}
              className="mr-1"
            />
            Irrelevant
          </label>
          <label className="mb-2 text-sm text-gray-500 items-center flex">
            <input
              type="radio"
              value="Incomplete"
              checked={rating === 'Incomplete'}
              onChange={handleRatingChange}
              className="mr-1"
            />
            Incomplete
          </label>
          <label className="mb-2 text-sm text-gray-500 items-center flex">
            <input
              type="radio"
              value="Other"
              checked={rating === 'Other'}
              onChange={handleRatingChange}
              className="mr-1"
            />
            Other
          </label>
        </div>
        <div className="mb-4">
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Provide additional feedback"
            className="w-full p-2 border border-gray-300 rounded text-sm h-24"
          />
        </div>

        <div className="flex gap-2 flex-row flex-center">
          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={isFeedbackSubmitted}
            className="w-full md:w-auto"
          >
            {isFeedbackSubmitted && (
              <IconSpinner className="mr-2 animate-spin" />
            )}
            Submit
          </Button>
          <Button
            variant="default"
            size="sm"
            type="button"
            onClick={handleCancel}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackComponent
