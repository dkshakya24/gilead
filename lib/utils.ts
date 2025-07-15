import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL =
  'https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev'
export const FEEDBACK_API =
  'https://wnpwxjhzvc.execute-api.us-east-1.amazonaws.com/dev/'
export const SUGGESTION_API =
  'https://gwmitkqkl6.execute-api.us-east-1.amazonaws.com/dev/'
export const WEBSOCKET =
  'wss://7x4ndqse6e.execute-api.us-east-1.amazonaws.com/dev'
export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME
export const PPT_GENERATE_API =
  'https://jnjldv2wrroq4d2yvxst5p7kki0basvl.lambda-url.us-east-1.on.aws/'
export const PPT_DOWNLOAD_API =
  'https://11vzxy3g5g.execute-api.us-east-1.amazonaws.com/dev/gilead_download_ppt_chat'
export const USER_MANAGEMENT_API =
  'https://bncqce2qts4p6kdmq4tkyls4va0blbkv.lambda-url.us-east-1.on.aws/'

export const EDIT_DELETE_CHAT_API =
  'https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev'
// export const AUTH_MICROSOFT_ENTRA_ID_ID =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_ID
// export const AUTH_MICROSOFT_ENTRA_ID_SECRET =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_SECRET
// export const AUTH_MICROSOFT_ENTRA_ID_ISSUER =
//   process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENTRA_ID_ISSUER

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return 'Invalid credentials!'
    case ResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case ResultCode.UserAlreadyExists:
      return 'User already exists, please log in!'
    case ResultCode.UserCreated:
      return 'User created, welcome!'
    case ResultCode.UnknownError:
      return 'Something went wrong, please try again!'
    case ResultCode.UserLoggedIn:
      return 'Logged in!'
  }
}

// bcrypt utilities for password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs')
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}

// Configuration for authentication strategy
export const AUTH_STRATEGY = {
  // IMPORTANT: Choose the correct strategy based on your API implementation
  //
  // Set to TRUE if your API expects to receive a hashed password and will compare it directly
  // with the stored hash in the database
  //
  // Set to FALSE if your API expects to receive a plain password and will hash it itself
  // before comparing with the stored hash
  SEND_HASHED_PASSWORD: true
}

// Get password for API payload based on authentication strategy
export const getPasswordForApi = async (password: string): Promise<string> => {
  if (AUTH_STRATEGY.SEND_HASHED_PASSWORD) {
    return await hashPassword(password)
  }
  return password
}
