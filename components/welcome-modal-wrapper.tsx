'use client'

import { useEffect, useState } from 'react'
import WelcomeModal from './welcome-modal'
import { usePathname } from 'next/navigation'

export default function WelcomeModalWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only check and show modal if we're not on the login page
    if (pathname !== '/login') {
      const showModal = sessionStorage.getItem('showWelcomeModal')
      if (showModal === 'true') {
        setIsOpen(true)
        // Clear the flag
        sessionStorage.removeItem('showWelcomeModal')
      }
    }
  }, [pathname]) // Re-run effect when pathname changes

  const handleClose = () => {
    setIsOpen(false)
  }

  return <WelcomeModal isOpen={isOpen} onClose={handleClose} />
}
