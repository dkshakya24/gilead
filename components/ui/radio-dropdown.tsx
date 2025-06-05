'use client'

import React, { useState, useEffect } from 'react'
import { Switch } from './switch'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'

interface Option {
  label: string
  value: string
}

const RadioDropdown: React.FC = () => {
  // Initialize the switch states

  const [selectedOption, setSelectedOption] = useState<string>('')
  // const [isAgentsShow, setIsAgentsShow] = useState<boolean>(true)

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSelectedOption(value)
    // localStorage.setItem('agent', value)
  }
  // const handleContentClick = (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  // }

  // Handle toggling switches
  // const handleToggle = (label: string) => {
  //   setSwitches(prevSwitches => {
  //     const isEnabled = prevSwitches.includes(label)

  //     if (isEnabled) {
  //       // If the label is already enabled, remove it
  //       return prevSwitches.filter(item => item !== label)
  //     } else {
  //       // If not, add it to the array
  //       return [...prevSwitches, label]
  //     }
  //   })
  // }

  // const handleSelect = (value: string) => {
  //   setSelectedOption(value)
  //   localStorage.setItem('', value)
  //   window.dispatchEvent(new Event('updateEvent'))
  // }

  // Sync state with localStorage

  // const handleToggle = () => {
  //   setIsAgentsShow(prevState => {
  //     const newState = !prevState
  //     if (newState) {
  //       // Automatically select 'generic' when toggle is turned on
  //       setSelectedOption('websearch')
  //       localStorage.setItem('agent', 'websearch')
  //     }
  //     return newState
  //   })
  // }

  // useEffect(() => {
  //   if (isAgentsShow && !selectedOption) {
  //     setSelectedOption('websearch')
  //     localStorage.setItem('agent', 'websearch')
  //   }
  //   localStorage.setItem('isAgentsShow', JSON.stringify(isAgentsShow))
  // }, [isAgentsShow])

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center justify-between w-full min-w-[155px]">
        <label
          className="pr-[15px] text-[15px] leading-none text-gray-800 cursor-pointer"
          htmlFor="co_positioning"
          // onClick={() => handleToggle()}
        >
          {/* {isAgentsShow ? 'AIVY Agents' : 'Default Agent'} */}
          {/* Enable Agents */}
        </label>
        {/* <Switch
          checked={isAgentsShow}
          onCheckedChange={() => handleToggle()}
          name="websearch"
          id="websearch"
        /> */}
      </div>
      {/* {isAgentsShow ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={selectedOption?.length > 1 ? 'secondary' : 'outline'}
              className={
                selectedOption?.length > 1
                  ? 'text-center flex gap-2 text-white min-w-[135px]'
                  : 'text-center flex gap-2 text-primary min-w-[135px]'
              }
            >
              {selectedOption === 'websearch'
                ? 'Web Search'
                : 'Select an Agent'}
              <ChevronDownIcon
                className={
                  selectedOption?.length > 0 ? 'text-white' : 'text-gray-800 '
                }
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8} align="start" className="w-fit">
            <div
              // className="origin-top-right right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="dropdownButton"
            >
              <div className="py-1">
                <div className="px-4 py-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="websearch"
                      value="websearch"
                      onChange={handleOptionChange}
                      checked={selectedOption === 'websearch'}
                    />
                    <span className="ml-2 text-sm">Web Search</span>
                  </label>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null} */}
    </div>
  )
}

export default RadioDropdown
