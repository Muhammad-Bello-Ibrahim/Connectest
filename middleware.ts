// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

const protectedRoutes = ["/dashboard", "/dashboard/admin", "/dashboard/club"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("connectrix-token")?.value

  if (!token) return NextResponse.redirect(new URL("/login", request.url))

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const userPayload = payload as { role?: string }

    // Block admin routes for non-admins
    if (pathname.startsWith("/dashboard/admin") && userPayload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Block club management routes for non-club accounts
    // Note: /dashboard/clubs (plural) is for browsing - allowed for all
    // /dashboard/club (singular) is for club management - only for club accounts
    if (pathname === "/dashboard/club" || pathname.startsWith("/dashboard/club/")) {
      if (userPayload.role !== "club") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/dashboard",
    "/dashboard/admin/:path*",
    "/dashboard/club/:path*",
    "/clubs/:clubId/manage/:path*"
  ],
}
// This middleware checks if the user is authenticated and authorized to access protected routes.
// If not, it redirects them to the login page or the appropriate dashboard based on their role