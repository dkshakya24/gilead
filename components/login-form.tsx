'use client'

import { useFormStatus, useFormState } from 'react-dom'
import { useEffect } from 'react'
import { authenticate } from '@/app/login/actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { InputField } from './ui/input-field'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/new-button'

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useFormState(authenticate, undefined)

  // const handleLogin = async () => {
  //   await signIn("microsoft-entra-id", { callbackUrl: "/" });
  // };

  useEffect(() => {
    if (state) {
      if (state.type === 'error') {
        toast.error(getMessageFromCode(state.resultCode))
      } else {
        toast.success(getMessageFromCode(state.resultCode), {
          position: 'top-right',
          className: 'bottom-auto'
        })
        // router.refresh()
        router.push('/arc')
      }
    }
  }, [state, router])

  return (
    <>
      <form action={formAction}>
        <div className="space-y-4">
          <div className="flex flex-col gap-y-4">
            <InputField
              id="email"
              type="email"
              icon="mail"
              label="Username"
              name="email"
              required
              // value={username}
              // onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              id="password"
              type="password"
              name="password"
              icon="lock"
              label="Password"
              required
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex -mt-2 items-center justify-between">
            <Checkbox id="remember-me" label="Remember me" />
            <Link
              href="/forgot-password"
              className="text-[12px] text-[#27272A] hover:text-crimson-600"
            >
              Forgot Password
            </Link>
          </div>

          <LoginButton />
        </div>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#F8F8F8] px-2 text-gray-500">Or login with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline">SSO Login</Button>
        <Button
          variant="outline"
          leftIcon={
            <Image
              src="/microsoft_logo.svg"
              alt="Microsoft"
              width={18}
              height={18}
            />
          }
        >
          Microsoft
        </Button>
      </div>
    </>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="danger" fullWidth aria-disabled={pending}>
      {pending ? <IconSpinner /> : 'Sign in'}
    </Button>
  )
}
