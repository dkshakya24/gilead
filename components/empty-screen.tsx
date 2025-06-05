import logoicon from '@/public/merck.png'
import Image from 'next/image'
import { FaHandPointUp } from 'react-icons/fa'

export function EmptyScreen({ infoMessage }: { infoMessage: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:max-w-[calc(100%-250px)] peer-[[data-state=open]]:xl:max-w-[calc(100%-300px)]">
      <div className="flex flex-col gap-2 bg-background p-8 py-0 text-center items-center">
        <Image
          className="w-[200px] mr-2 dark:hidden hidden md:block"
          src={logoicon}
          alt="icon"
        />
        <h1 className="text-lg font-semibold text-primary dark:text-white pt-2">
          Hi! I'm WAO
        </h1>
        <p className="leading-normal text-gray-600 md:text-gray-400 dark:text-white text-xs md:text-sm">
          {/* <i>{infoMessage}</i> */}
          Your AI powered Congress Assistant. To get the best insights during
          ASCO 2025, please select your topic of interest from the dropdown list
          above that you want to learn more about. Let’s dive in!
        </p>
      </div>
    </div>
  )
}
