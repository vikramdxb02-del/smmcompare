import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isCreateAdminPage = req.nextUrl.pathname === '/admin/create-admin'

    // Allow create-admin page without authentication
    if (isCreateAdminPage) {
      return NextResponse.next()
    }

    // Protect admin routes (except create-admin)
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow /admin/create-admin
        if (req.nextUrl.pathname === '/admin/create-admin') {
          return true
        }

        // Allow access to public pages
        if (req.nextUrl.pathname === '/' || 
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register')) {
          return true
        }

        // Require authentication for dashboard and admin
        return !!token
      },
    },
  }
)

export default middleware

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}

