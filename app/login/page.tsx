import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LoginForm from '@/components/login-form'
import rightimage from '@/public/loginimage.png'

export default function Page() {
  return (
    <div className="min-h-screen py-4 px-4">
      <div className="flex gap-x-4 h-[calc(100vh-2rem)]">
        {/* Left Side */}
        <div className="flex-grow flex flex-col p-4 items-center justify-center rounded-3xl bg-[#F8F8F8] shadow-[0_0_6px_rgba(0,0,0,0.2)]">
          <div className="w-full max-w-[400px]">
            <div className="mb-6">
              <Image
                src="/chrylogo.svg"
                alt="Gilead Logo"
                width={120}
                height={30}
                className="mb-4"
              />
              <div
                className="text-xl mb-1 font-medium text-[#27272A]"
                style={{ fontFamily: 'Calibri, sans-serif' }}
              >
                Welcome to ARC
              </div>
              <p className="text-sm text-[#909090]">
                Stay ahead with AI-powered content aggregation and summarization
                for executives, teams, and professionals.
              </p>
            </div>

            <LoginForm />

            <div className="mt-5 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <span
                // href="/register"
                className="font-semibold text-[#27272A]"
              >
                Register
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-shrink-0">
          <Image
            src={rightimage}
            alt="Platform Interface"
            className="h-[calc(100vh-2rem)] w-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
