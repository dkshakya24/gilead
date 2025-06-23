import logoicon from '@/public/prompt-anime.gif'
import Image from 'next/image'

import { Session } from '@/lib/types'

export function EmptyScreen({ session }: { session: Session }) {
  return (
    <div className="mx-auto max-w-3xl px-4 transition-all duration-300 ease-in-out peer-[[data-state=open]]:lg:max-w-[calc(100%-250px)] peer-[[data-state=open]]:xl:max-w-[calc(100%-320px)]">
      <div className="flex flex-col gap-2  p-8 py-0 text-center items-center">
        <Image
          className="w-[200px] mr-2 dark:hidden hidden md:block"
          src={logoicon}
          alt="icon"
        />
        <h1 className="text-[24px] font-medium text-center bg-gradient-to-r from-[#FF9892] to-[#870002] bg-clip-text text-transparent">
          Welcome to GABI ARC, {session?.user?.name} !
        </h1>

        <p className="text-[#666666] text-center text-[16px]">
          Ask me anything – from quick info to deep dives, I&apos;m here to
          assist you anytime.
        </p>
      </div>
    </div>
  )
}
