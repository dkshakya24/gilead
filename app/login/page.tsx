import { auth } from '@/auth'
import LoginForm from '@/components/login-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'
import medicen from '@/public/medicen.svg'
import Image from 'next/image'
import logoicon from '@/public/merck1.png'

export default async function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Section */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950 px-4 py-8 lg:px-8 lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="space-y-6 text-center">
              <h1 className="text-lg sm:text-2xl font-bold text-primary leading-tight">
                Welcome to <br /> gilead AI Assistant
              </h1>
              <div className="flex justify-center">
                <Image
                  className="w-[150px] sm:w-[200px] dark:hidden rounded-lg"
                  src={logoicon}
                  alt="Merck Logo"
                  priority
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="w-full">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:flex items-center justify-center lg:w-1/2 bg-white dark:bg-gray-900">
          <div className="relative w-full h-full max-w-[800px] p-8 flex items-center justify-center">
            <Image
              src={medicen}
              alt="Medical Illustration"
              className="w-full h-auto object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
