import logoicon from '@/public/GileadLogo.svg'

import Link from 'next/link'
import Image from 'next/image'
import GenitourinaryDashboard from '@/components/GenitourinaryDashboard'
import { Header } from '@/components/header'

export default function WAOLandingPage() {
  return (
    <>
      <Header />
      <div className="p-6 bg-[#F8F8FC] h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl text-gray-600 font-medium">
            Welcome to{' '}
            <b className="font-bold text-secondary">AIVY AI Assistant</b>
            <br />
            <i className="text-gray-400 text-sm">
              Your AI Powered Congress Assistant
            </i>
          </h1>
          <Link
            href="/aivy"
            className="bg-secondary mr-5 text-white px-3 py-2 rounded-md text-sm font-medium flex flex-row h-10 flex items-center"
          >
            {/* <div className="size-6 rounded-full bg-background border cursor-pointer mr-2">
              <Image className="w-[100%] p-1" src={logoicon} alt="icon" />
            </div> */}
            Ask Assistant
          </Link>
        </div>

        <div className="p-4 rounded-lg border-[1px] border-solid border-[#D2D2D2] bg-white mb-8">
          <div className="flex flex-col mb-4 w-full justify-center text-center">
            <div className="text-[16px] font-medium text-primary">
              Congress Data Insights Hub
            </div>
            <div className="text-gray-400 text-sm">
              Leveraging Generative AI to Uncover Trends and Drive Tactical
              Decisions
            </div>
          </div>
          <div>
            <GenitourinaryDashboard />
          </div>
        </div>
      </div>
    </>
  )
}
