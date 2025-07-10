import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Cross2Icon } from '@radix-ui/react-icons'
import { MdOutlineInsertComment } from 'react-icons/md'

const Annotations = ({
  setIsAnnotationsClicked,
  // chatId,
  // selectedText,
  // startOffset,
  // endOffset
  data
}: {
  setIsAnnotationsClicked: (value: boolean) => void
  data: any
  // chatId?: string
  // selectedText: string
  // startOffset: number
  // endOffset: number
}) => {
  const [annotations, setAnnotations] = useState<any>()
  const [responseIdd, setResponseIdd] = useState('')
  const [isTruncate, setIstruncate] = useState(false)
  const annotationref = useRef<HTMLDivElement>(null)
  console.log(responseIdd, 'responseIddgiii')

  const pathname = usePathname()
  useEffect(() => {
    const pathParts = pathname.split('/')
    const responseIdFromPath = pathParts[pathParts.length - 1]
    setResponseIdd(responseIdFromPath)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        annotationref.current &&
        !annotationref.current.contains(event.target as Node)
      ) {
        setIsAnnotationsClicked(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsAnnotationsClicked])
  const toggleText = () => {
    setIstruncate(!isTruncate)
  }
  // const handleRatingChange = (e: any) => {
  //   setRating(e.target.value)
  // }

  // const handleFeedbackChange = (e: any) => {
  //   setFeedback(e.target.value)
  // }

  // const handleCancel = () => {
  //   setIsAnnotationsClicked(false) // Hide feedback form
  // }

  return (
    <div
      ref={annotationref}
      className="flex flex-col bottom-24 right-4 max-w-md mx-auto p-4 border border-gray-300 bg-white rounded-lg shadow-lg max-w-[350px] lg:max-w-[300px] md:min-w-[250px] xl:min-w-[300px] h-[70vh]"
    >
      <h2 className="text-md font-semibold mb-4 text-primary flex justify-between">
        <span>Your Feedbacks</span>
        <Cross2Icon
          className="size-6 text-primary right-2 top-2 cursor-pointer"
          onClick={() => {
            setIsAnnotationsClicked(false)
          }}
        />
      </h2>

      <section className="relative flex flex-col gap-2 overflow-auto w-full">
        <div className="annotations">
          {data && data?.length > 0 ? (
            data.map((annotation: any) => (
              <div
                key={annotation.annotationId}
                className="rounded-lg shadow-md border border-gray-300 p-4 relative mt-2"
              >
                <p
                  className={
                    isTruncate
                      ? 'pt-2 text-xs text-gray-400'
                      : 'pt-2 text-xs text-gray-400 truncate'
                  }
                >
                  {annotation.text}
                  {/* {isTruncate ? (
                    <MdKeyboardArrowUp
                      className="text-primary text-md"
                      onClick={toggleText}
                    />
                  ) : (
                    <MdKeyboardArrowDown
                      className="text-primary text-md"
                      onClick={toggleText}
                    />
                  )} */}
                </p>
                <p className="absolute top-0 bg-secondary text-xs text-white px-2 rounded-sm left-0 top-0">
                  {annotation.category}
                </p>
                <p className="text-sm text-gray-700 pt-2">
                  <MdOutlineInsertComment className="text-sm text-primary mt-1 inline mr-2" />
                  <span>{annotation.comment}</span>
                </p>
              </div>
            ))
          ) : data && data?.length === 0 ? (
            <div className="pt-4 w-full text-center">
              <p className="text-sm">No Feedback Found</p>
            </div>
          ) : (
            <div className="animate-pulse space-y-4 px-4 lg:w-[250px] md:min-w-[250px] xl:min-w-[250px] h-[70vh]">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {/* <div className="bg-gray-300 rounded-full h-6 w-6"></div> */}
                  <div className="flex-1 space-y-2 py-1">
                    {/* <div className="h-4 bg-gray-300 rounded w-3/4"></div> */}
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Annotations
