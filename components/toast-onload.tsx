'use client'

import { useEffect } from 'react'
// import { toast } from 'react-toastify'
import { toast } from 'sonner'

const ToastOnLoad = () => {
  useEffect(() => {
    const showToast = sessionStorage.getItem('showWelcomeToast')
    if (showToast === 'true') {
      toast.success(
        'Please select the topic of interest you want to ask questions about',
        {
          position: 'top-right',
          className: 'bottom-auto top-2'
        }
      )
      // Clear the flag after showing the toast
      sessionStorage.removeItem('showWelcomeToast')
    }
  }, [])

  return null
}

export default ToastOnLoad
