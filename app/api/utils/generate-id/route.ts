import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const uuid = uuidv4()
    return NextResponse.json({ id: uuid }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate UUID' },
      { status: 500 }
    )
  }
}
