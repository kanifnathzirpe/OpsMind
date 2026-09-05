import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = (pathname: string) => 
  pathname.startsWith('/dashboard') || pathname.startsWith('/settings')

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('opsmind_session')?.value

  // Check if user is authenticated
  const isAuthenticated = !!token

  // Redirect protected routes to login if not authenticated
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect auth pages to dashboard if already authenticated
  if (isAuthenticated && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
