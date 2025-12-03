import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { prisma } from './lib/db'

const middleware = withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isCreateAdminPage = req.nextUrl.pathname === '/admin/create-admin'
    const isDebugPage = req.nextUrl.pathname === '/admin/debug'

    // Allow create-admin and debug pages without authentication
    if (isCreateAdminPage || isDebugPage) {
      return NextResponse.next()
    }

    // For admin routes, check role from database if token doesn't have it
    if (isAdminRoute && token) {
      let isAdmin = token.role === 'ADMIN'
      
      // If role not in token, check database directly
      if (!isAdmin && token.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { role: true }
          })
          isAdmin = user?.role === 'ADMIN'
        } catch (error) {
          console.error('Error checking admin role:', error)
        }
      }

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow /admin/create-admin and /admin/debug
        if (req.nextUrl.pathname === '/admin/create-admin' || 
            req.nextUrl.pathname === '/admin/debug') {
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

