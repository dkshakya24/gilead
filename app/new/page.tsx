'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store/useStore'

export default function NewPage() {
  const { setChatMessages } = useStore()
  const router = useRouter()

  useEffect(() => {
    setChatMessages([])
    router.replace('/arc')
  }, [setChatMessages, router])

  return null
}