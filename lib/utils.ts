import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// export const API_URL = "https://arc.gabi.gilead.com/api"
// export const FEEDBACK_API ='https://arc.gabi.gilead.com/api'
// export const SUGGESTION_API ='https://arc.gabi.gilead.com/api/get_suggested_questions'
// export const WEBSOCKET = "wss://arc.gabi.gilead.com/ws/chat"
// export const PROJECT_NAME = "gilead"
// export const PPT_GENERATE_API ='https://arc.gabi.gilead.com/api/generate_chathistory_ppt'
// export const PPT_DOWNLOAD_API ='https://arc.gabi.gilead.com/api/download_ppt'
// export const USER_MANAGEMENT_API ='http://commercial-ds-gabi-arc-app-backend:8000/api/user_action'
// export const USER_LIST_MANAGEMENT_API ='https://arc.gabi.gilead.com/api/user_action'
// export const EDIT_DELETE_CHAT_API ='https://arc.gabi.gilead.com/api'
// export const DOCX_GENERATE_API ='https://arc.gabi.gilead.com/api/docx_export'


export const API_URL =
  'https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev'
export const FEEDBACK_API =
  'https://wnpwxjhzvc.execute-api.us-east-1.amazonaws.com/dev/'
export const SUGGESTION_API =
  'https://gwmitkqkl6.execute-api.us-east-1.amazonaws.com/dev/'
export const WEBSOCKET =
  'wss://7x4ndqse6e.execute-api.us-east-1.amazonaws.com/dev'
export const PROJECT_NAME = "gilead"
export const PPT_GENERATE_API =
  'https://jnjldv2wrroq4d2yvxst5p7kki0basvl.lambda-url.us-east-1.on.aws/'
export const PPT_DOWNLOAD_API =
  'https://11vzxy3g5g.execute-api.us-east-1.amazonaws.com/dev/gilead_download_ppt_chat'
export const USER_LIST_MANAGEMENT_API =
  'https://bncqce2qts4p6kdmq4tkyls4va0blbkv.lambda-url.us-east-1.on.aws/'
export const USER_MANAGEMENT_API =
  'https://bncqce2qts4p6kdmq4tkyls4va0blbkv.lambda-url.us-east-1.on.aws/'

export const EDIT_DELETE_CHAT_API =
  'https://6try2laitd.execute-api.us-east-1.amazonaws.com/dev'

export const DOCX_GENERATE_API =
  'https://g6dy9f8dr4.execute-api.us-east-1.amazonaws.com/dev/'


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
