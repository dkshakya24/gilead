'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store/useStore'

export default function NewPage() {
  const { setChatMessages } = useStore()
  const router = useRouter()

  useEffect(() => {
    setChatMessages([])
    // Set flag to indicate we're coming from new chat
    sessionStorage.setItem('fromNewChat', 'true')
    router.replace('/arc')
  }, [setChatMessages, router])

  return null
}
