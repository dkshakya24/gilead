'use server'

import { signIn } from '@/auth'
import { User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { ResultCode } from '@/lib/utils'

const users = [
  {
    id: '1',
    email: 'admin@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'qbc'
  },
  {
    id: '2',
    email: 'joshua.jose@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '3',
    email: 'renuka.sai@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '4',
    email: 'prakash.karaka@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '5',
    email: 'venkateshwar.gopisetti@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '6',
    email: 'amith.k@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '7',
    email: 'deepak.kumar@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '8',
    email: 'subhranjit.sahoo@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '9',
    email: 'wchan@menarinistemline.com',
    password: 'wchan@stemline321',
    salt: 'gbc'
  },
  {
    id: '10',
    email: 'ekole@menarinistemline.com',
    password: 'ekole@stemline123',
    salt: 'gbc'
  },
  {
    id: '11',
    email: 'srikanth.bharatham@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '12',
    email: 'gaurav.soni@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '13',
    email: 'dilip.kotha@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '14',
    email: 'mirtunjay.kumar@novartis.com',
    password: 'Pr3cision@ascvd2025',
    salt: 'gbc'
  },
  {
    id: '15',
    email: 'sybil.mathew@novartis.com',
    password: 'Pr3cision@ascvd2025',
    salt: 'gbc'
  },
  {
    id: '16',
    email: 'smriti.arora@novartis.com',
    password: 'Pr3cision@ascvd2025',
    salt: 'gbc'
  },
  {
    id: '17',
    email: 'bhaskar.sarma@novartis.com',
    password: 'Pr3cision@ascvd2025',
    salt: 'gbc'
  },
  {
    id: '18',
    email: 'ashley.peterson@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '19',
    email: 'jyotsna.mulgund@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '20',
    email: 'melina.heller-false-speiser@merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '21',
    email: 'wolfgang.helbig@external.merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '22',
    email: 'kiran-narasimha.rao@external.merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '23',
    email: 'prakash.sm@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '24',
    email: 'ramakrishna.kodam@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '25',
    email: 'anirudha.n@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '26',
    email: 'subhranjit.sahoo@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '27',
    email: 'kyle.ying@merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '28',
    email: 'chetak.buaria@merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '29',
    email: 'robert.ahlert@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '30',
    email: 'elise.wang@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '31',
    email: 'jiamin.zhuo@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '32',
    email: 'myriam.hnatkow@merckgroup.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '33',
    email: 'seval.sonmez@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '34',
    email: 'suraj.moorthy@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '35',
    email: 'irana.kolev@emdserono.com',
    password: 'J9#mP2$vL5@nX8&qR4',
    salt: 'gbc'
  },
  {
    id: '36',
    email: 'sanirudha.n@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '37',
    email: 'avinash.tiwari@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  },
  {
    id: '38',
    email: 'pavithra.p@chryselys.com',
    password: 'Admin@chryselys123',
    salt: 'gbc'
  }

  // Add more users as needed
]

// export async function getUser(email: string) {
//   const user = await kv.hgetall<User>(`user:${email}`)
//   return user
// }

export async function getUser(
  email: string,
  password: string
): Promise<User | undefined> {
  const user = users.find(
    user => user.email === email && user.password === password
  )
  return user
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}
