import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
interface MultiSelectDropdownProps {
  session: any
  setIsLoadingSuggestions: (loading: boolean) => void
  setSuggestionQuestions: (questions: string[]) => void
  dataKey?: string[]
}
import { DateTime } from 'luxon'
import { SUGGESTION_API } from '@/lib/utils'
interface IOption {
  label: string
  value: string
  description: string
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  session,
  setIsLoadingSuggestions,
  setSuggestionQuestions,
  dataKey
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [options, setOptions] = useState<IOption[]>([
    {
      label: 'UC',
      value: 'UC',
      description:
        'Currently, we have 44 abstracts pertaining to Erbutix within CRC & SCHNN data, and 25 relating to Bavencio under Bladder cancer'
    },
    {
      label: 'CRC',
      value: 'CRC',
      description: 'Currently we have 2025 Program details'
    },
    ...(session?.user.email === 'irana.kolev@emdserono.com' ||
    session?.user.email === 'ramakrishna.kodam@chryselys.com'
      ? [
          {
            label: 'LC',
            value: 'LC',
            description: ''
          }
        ]
      : []),
    {
      label: 'SCCHN',
      value: 'SCCHN',
      description: ''
    }
  ])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toggleDropdown = () => setIsOpen(!isOpen)
  const chicagoTime = DateTime.now().setZone('America/Chicago')
  const formatted = chicagoTime.toFormat('yyyy-MM-dd')
  console.log(formatted, 'formatted')

  const fetchSuggestions = async (option: string) => {
    try {
      const response = await fetch(`${SUGGESTION_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: session?.user.email,
          indication: option,
          date: formatted
        })
      })
      const data = await response.json()
      if (response.ok) {
        setSuggestionQuestions(data)
        setIsLoadingSuggestions(false)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  useEffect(() => {
    if (dataKey && dataKey.length > 0) {
      setSelectedOption(dataKey[0])
      localStorage.setItem('studies', JSON.stringify(dataKey))
      window.dispatchEvent(new Event('updateLocalStorage'))
    } else {
      const storedStudies = localStorage.getItem('studies')
      if (storedStudies) {
        const parsedStudies = JSON.parse(storedStudies)
        setSelectedOption(parsedStudies[0] || '')
      }
    }
  }, [dataKey])

  useEffect(() => {
    if (selectedOption && selectedOption.length > 0) {
      fetchSuggestions(selectedOption)
      setIsLoadingSuggestions(true)
    }
    console.log(selectedOption, 'selectedOption21')
  }, [selectedOption])

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    localStorage.setItem('studies', JSON.stringify([option]))
    window.dispatchEvent(new Event('updateLocalStorage'))
    // Call fetchSuggestions with the new option
    fetchSuggestions(option)
    setIsLoadingSuggestions(true)
    setIsOpen(false)

    // Check if current path includes /aivy/chat and redirect to new chat
    if (pathname?.includes('/arc/chat')) {
      router.push('/new')
    }
  }
  // const clearSelection = () => {
  //   setSelectedOption('')
  //   localStorage.setItem('studies', JSON.stringify([]))
  //   window.dispatchEvent(new Event('updateLocalStorage'))
  // }

  const renderSelectedText = () => {
    if (selectedOption) {
      return options.find(option => option.value === selectedOption)?.label
    }
    return 'Select Topic'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex gap-2 items-center">
      <div>
        <p className="text-md md:text-md text-primary">
          <b>Select Topic Of Interest</b>
        </p>
      </div>
      <div className="relative w-[150px]" ref={dropdownRef}>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center border border-gray-300 rounded-[20px] px-2 md:px-3 py-1 md:py-1 cursor-pointer bg-white shadow-sm"
              onClick={toggleDropdown}
            >
              <div className="flex-1 truncate">
                <span
                  className={
                    selectedOption
                      ? 'text-gray-600 text-[14px]'
                      : 'text-gray-500 text-[14px]'
                  }
                >
                  {renderSelectedText()}
                </span>
              </div>
              <div className="ml-2">
                {isOpen ? (
                  <FaChevronUp className="text-primary text-sm" />
                ) : (
                  <FaChevronDown className="text-primary text-sm" />
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="z-100">
            Select an Indication to query.
          </TooltipContent>
        </Tooltip> */}
        <div
          className="flex items-center border border-gray-300 rounded-[10px] px-2 md:px-3 py-2 md:py-2 cursor-pointer bg-white shadow-sm"
          onClick={toggleDropdown}
        >
          <div className="flex-1 truncate">
            <span
              className={
                selectedOption
                  ? 'text-gray-600 text-[14px]'
                  : 'text-gray-500 text-[14px]'
              }
            >
              {renderSelectedText()}
            </span>
          </div>
          <div className="ml-2">
            {isOpen ? (
              <FaChevronUp className="text-primary text-sm" />
            ) : (
              <FaChevronDown className="text-primary text-sm" />
            )}
          </div>
        </div>
        {isOpen && (
          <div className="absolute mt-1 border border-gray-300 rounded-md bg-white shadow-lg w-full z-[999] max-h-60 overflow-y-auto">
            {options.map(option => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedOption === option.value ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center w-full justify-between">
                  <span className="text-[14px] px-1 leading-5 w-full">
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelectDropdown
