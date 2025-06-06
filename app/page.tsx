// import { auth } from '@/auth'
// import { redirect } from 'next/navigation'
// import { Session } from '@/lib/types'
// import WAOLandingPage from '@/components/wao-landingpage'

// export default async function Home() {
//   const session = (await auth()) as Session

//   if (!session?.user) {
//     redirect('/login')
//   }

//   return (
//     <>
//       <div className="flex w-full flex-col justify-center">
//         <WAOLandingPage />
//       </div>
//     </>
//   )
// }

import { redirect } from 'next/navigation'

export default async function NewPage() {
  redirect('/arc')
}
