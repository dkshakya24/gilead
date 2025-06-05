'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/login/actions'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="mt-6 flex h-11 sm:h-10 w-full flex-row items-center justify-center rounded-md bg-secondary p-2 text-sm font-semibold text-white hover:bg-secondary/90 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 touch-manipulation"
    >
      {pending ? <IconSpinner className="animate-spin" /> : 'Login'}
    </button>
  )
}

export default function LoginForm() {
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const router = useRouter()
  const [result, dispatch] = useFormState(authenticate, undefined)

  const handleMicrosoftLogin = async () => {
    await signIn('microsoft-entra-id', { callbackUrl: '/aivy' })
    sessionStorage.setItem('showWelcomeModal', 'true')
  }

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else {
        toast.success(getMessageFromCode(result.resultCode), {
          position: 'top-right',
          className: 'bottom-auto'
        })
        sessionStorage.setItem('showWelcomeModal', 'true')
        sessionStorage.setItem('showWelcomeToast', 'true')
        router.push('/')
      }
    }
    localStorage.removeItem('studies')
  }, [result, router])

  return (
    <div className="flex flex-col items-center gap-4 space-y-3 w-full px-4 sm:px-0">
      <div className="w-full flex-1 rounded-lg border bg-white px-4 sm:px-6 pb-4 pt-6 sm:pt-8 shadow-lg sm:w-96 dark:bg-zinc-950 transition-all duration-200 hover:shadow-xl">
        <h1 className="mb-3 text-lg sm:text-xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
          Please log in to continue.
        </h1>
        <div className="flex flex-col gap-4">
          <button
            className="flex h-11 sm:h-10 w-full flex-row items-center justify-center gap-2 rounded-md bg-[#2F2F2F] p-2 text-sm font-medium text-white hover:bg-[#404040] transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            onClick={handleMicrosoftLogin}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23 3H3V23H23V3Z" fill="#F25022" />
              <path d="M45 3H25V23H45V3Z" fill="#7FBA00" />
              <path d="M23 25H3V45H23V25Z" fill="#00A4EF" />
              <path d="M45 25H25V45H45V25Z" fill="#FFB900" />
            </svg>
            Login with SSO (Merck Credentials)
          </button>

          <div className="relative flex items-center justify-center w-full my-2">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              or
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <button
            className="flex h-11 sm:h-10 w-full flex-row items-center justify-center rounded-md bg-secondary p-2 text-sm font-semibold text-white hover:bg-secondary/90 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 touch-manipulation transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setShowEmailPopup(true)}
            type="button"
          >
            Login with Email
          </button>
        </div>
      </div>

      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <form
            action={dispatch}
            className="w-full max-w-[384px] rounded-lg border bg-white px-6 py-8 shadow-lg dark:bg-zinc-950 transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                Login with Email
              </h1>
              <button
                type="button"
                onClick={() => setShowEmailPopup(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                ✕
              </button>
            </div>
            <div className="w-full">
              <div>
                <label
                  className="mb-2 sm:mb-3 block text-xs font-medium text-zinc-400 transition-colors"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border bg-zinc-50 px-3 py-2.5 sm:py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-2 sm:mb-3 block text-xs font-medium text-zinc-400"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border bg-zinc-50 px-3 py-2.5 sm:py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <SubmitButton />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
