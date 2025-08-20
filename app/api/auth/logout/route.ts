import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Clear the app session cookie
  response.cookies.set('rotasi_session', '', {
    path: '/',
    maxAge: 0,
  })
  return response
}


