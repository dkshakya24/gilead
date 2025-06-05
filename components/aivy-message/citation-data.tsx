import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { GrDocumentImage } from 'react-icons/gr'
import { MdOutlineCloseFullscreen } from 'react-icons/md'
import { BsChatQuote } from 'react-icons/bs'
import { Calendar, GroupIcon, Pin, User } from 'lucide-react'
import { FaUserGroup } from 'react-icons/fa6'
interface CitationComponentProps {
  hrefValue: string
  citations: Array<{
    source_id: string
    doc_name: string
    page_num: string
    img_url: string
    quote: string
    Title: string
    Date: string
    Presented_by: string
    Place: string
  }>
  setIsCitationModalClicked: (value: boolean) => void
}

const CitationComponent: React.FC<CitationComponentProps> = ({
  hrefValue,
  citations,
  setIsCitationModalClicked
}) => {
  const [matchedCitation, setMatchedCitation] = useState<{
    source_id: string
    doc_name: string
    page_num: string
    img_url: string
    Title: string
    Date: string
    quote: string
    Presented_by: string
    Place: string
  } | null>(null)
  const cirataionModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cirataionModalRef.current &&
        !cirataionModalRef.current.contains(event.target as Node)
      ) {
        setIsCitationModalClicked(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsCitationModalClicked])

  useEffect(() => {
    const sourceId = hrefValue.replace('#', '')
    const foundCitation = citations?.find(
      citation => citation.source_id === sourceId
    )
    console.log(foundCitation, citations, 'foundCitation')

    setMatchedCitation(foundCitation ?? null)
  }, [hrefValue, citations])

  const handleCancel = () => {
    setIsCitationModalClicked(false) // Hide feedback form
  }

  return (
    <div>
      {matchedCitation && citations.length > 0 ? (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center w-full justify-center z-[999]">
            <div
              ref={cirataionModalRef}
              className="w-full md:max-w-[58%] max-h-[90vh] flex flex-col relative bg-white rounded-md p-2 box-border overflow-hidden mx-2"
            >
              <div className="flex flex-col gap-2 px-2 justify-center w-full pb-3">
                <p className="text-sm text-primary text-white text-center bg-secondary rounded-sm p-1 max-w-[200px]">
                  Citation ID: {matchedCitation.source_id}
                </p>

                <h2 className="text-xs md:text-sm flex gap-2">
                  <i>
                    {' '}
                    <b> Abstract Title -</b> {matchedCitation.Title}
                  </i>
                </h2>
                <h2 className="text-xs md:text-sm flex flex-row justify-start gap-3 py-2">
                  {/* <span className="flex flex-row gap-2 items-center">
                                    {' '}
                                    <Calendar className="text-sm md:text-md text-primary" />
                                    <i>{item.Date}</i>
                                  </span>
                                  <span className="flex flex-row gap-2 items-center">
                                    {' '}
                                    <Pin className="text-sm md:text-md text-primary" />
                                    <i>{item.Place}</i>
                                  </span> */}
                  <span className="flex flex-row gap-2 items-center text-gray-600">
                    <i>
                      <b> Presented By -</b>
                    </i>
                    <FaUserGroup className="text-sm text-primary" />
                    <i className="max-w-[300px] truncate">
                      {matchedCitation.Presented_by}
                    </i>
                  </span>
                  {/* <q>
                    {' '}
                    <i>{matchedCitation.quote}</i>
                  </q> */}
                </h2>
              </div>

              <button
                className="absolute top-2 right-2 text-white text-2xl z-10"
                onClick={() => {
                  handleCancel()
                }}
              >
                <MdOutlineCloseFullscreen className="bg-primary text-white rounded-full p-1 w-[30px] h-[30px]" />
              </button>

              <div className="flex-1 overflow-y-auto">
                <Image
                  className="w-full object-contain object-center border border-gray-200 rounded-sm"
                  src={matchedCitation.img_url}
                  alt="icon"
                  width={800}
                  height={800}
                  priority
                />
              </div>

              <div className="w-full flex flex-row gap-2 justify-between items-center py-2 mt-2">
                <p className="text-sm md:text-base flex gap-2 break-all flex-1">
                  <GrDocumentImage className="text-xl text-primary flex-shrink-0" />
                  {matchedCitation.doc_name}
                </p>
                <p className="text-sm md:text-base text-primary text-white text-center bg-secondary rounded-sm px-2 py-1 flex-shrink-0">
                  {matchedCitation.page_num}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[999]">
          <div
            ref={cirataionModalRef}
            className="w-full max-w-full md:max-w-[500px] max-h-[90%] flex flex-col relative bg-white rounded-md p-2 box-border mx-2"
          >
            <div className="flex flex-col justify-between text-primary px-2">
              <div className="h-4 my-4 text-center">
                <h2 className="text-sm md:text-base">
                  Please wait while citations are loading....
                </h2>
              </div>
              {/* <div className="animate-pulse space-y-4 px-4 lg:w-[500px] md:min-w-[500px] xl:min-w-[500px] h-[70vh]">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CitationComponent
