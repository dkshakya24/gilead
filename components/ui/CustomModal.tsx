import React, { useEffect, useRef, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface IModalProps {
  isModalOpen: boolean
  closeModal: () => void
  children: ReactNode
  width?: string
  padding?: string
  minWidth?: string
}

const CustomModal: React.FC<IModalProps> = ({
  isModalOpen,
  children,
  closeModal,
  padding = '0',
  width = 'auto',
  minWidth = 'auto'
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Add event listener for outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isModalOpen, closeModal])

  if (typeof window === 'undefined') return null

  return isModalOpen
    ? ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[hsla(202,33%,95%,0.51)] z-50">
          <div
            ref={modalRef}
            className="relative flex flex-col items-center justify-center max-h-[86vh] bg-white shadow-lg"
            style={{ width, minWidth }}
          >
            <div className="overflow-auto" style={{ padding }}>
              {children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null
}

export default CustomModal
