'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { IoInformationCircle } from 'react-icons/io5'

interface ExternalDataFlagProps {
  onExternalDataChange: (value: boolean) => void
}

const ExternalDataFlag: React.FC<ExternalDataFlagProps> = ({
  onExternalDataChange
}) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsChecked(checked)
    onExternalDataChange(checked) // Send true/false to parent
    if (!isChecked) {
      toast.success(
        <div className="flex items-center gap-2">
          <IoInformationCircle className="text-secondary text-2xl" />
          <div>
            <p className="pb-1 font-bold">
              {' '}
              The following external data sources are selected :
            </p>
            <ul className="text-xs flex flex-row gap-1">
              <li>1. APP Conversations,</li>
              <li>2. Emerald Testing Files,</li>
              <li>3. ASCO Blogs</li>
            </ul>
          </div>
        </div>,
        {
          position: 'top-right',
          className: 'bottom-auto top-2',
          closeButton: true
        }
      )
    }
  }

  return (
    <div
      className={
        isChecked
          ? 'border border-primary border-2 px-2 py-2 rounded-md flex gap-2 items-center bg-primary'
          : 'border border-primary border-2 px-2 py-2 rounded-md flex gap-2 items-center bg-primary'
      }
    >
      <input
        type="checkbox"
        id="externalDataCheckbox"
        className="form-checkbox text-primary cursor-pointer"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor="externalDataCheckbox"
        className={
          isChecked
            ? 'text-sm font-medium text-white cursor-pointer'
            : 'text-sm font-medium text-white cursor-pointer'
        }
      >
        External Data
      </label>
    </div>
  )
}

export default ExternalDataFlag
