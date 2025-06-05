// src/components/Modal.js
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface IModalProps {
  isModalOpen: boolean
  closeModal: (isOpen: boolean) => void
  children: ReactNode
  width?: string
  padding?: string
  minWidth?: string
}

const Modal: React.FC<IModalProps> = ({
  isModalOpen,
  closeModal,
  children,
  width = '450px',
  padding = '0',
  minWidth = '0'
}) => {
  if (typeof window === 'undefined') return null

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal(false)
    }
  }

  return isModalOpen
    ? ReactDOM.createPortal(
        <div
          className="fixed inset-0 flex items-start justify-center backdrop-blur-sm z-50 sm:max-w-[425px] w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg"
          onClick={handleBackdropClick}
        >
          <div
            className="relative flex flex-col items-center justify-center max-h-[95vh]"
            style={{ width, minWidth }}
          >
            <div className="overflow-auto w-full" style={{ padding }}>
              {children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null
}

export default Modal
