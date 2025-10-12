import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const uuid = uuidv4()
    return NextResponse.json(
      { id: uuid },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store'
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate UUID' },
      { status: 500 }
    )
  }
}
