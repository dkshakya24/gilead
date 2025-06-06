import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const protectedRoutes = ['/acr']
const authPageRoutes = ['/login']
const apiAuthPrefix = '/api/auth'

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const path = nextUrl.pathname
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isProtectedRoute = protectedRoutes.includes(path)
  const isAuthPageRoute = authPageRoutes.includes(path)

  // Get the absolute URL base from the request
  const baseURL = `${req.nextUrl.protocol}//${req.nextUrl.host}`

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // If user is not logged in and tries to access protected route, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginURL = new URL('/login', baseURL)
    return NextResponse.redirect(loginURL)
  }

  // If user is logged in and tries to access auth page, redirect to protected route
  if (isLoggedIn && isAuthPageRoute) {
    const homeURL = new URL('/', baseURL)
    return NextResponse.redirect(homeURL)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    // Include auth routes explicitly
    '/login'
  ]
}
