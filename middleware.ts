// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { refreshAccessToken, setAuthCookies, getAuthTokens } from "@/lib/auth"

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

const protectedRoutes = ["/dashboard", "/dashboard/admin", "/dashboard/club"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtected) return NextResponse.next()

  const { accessToken, refreshToken } = getAuthTokens(request)

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Try to verify access token first
    if (accessToken) {
      const { payload } = await jwtVerify(accessToken, getJwtSecret())
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
    }

    // If no access token but we have refresh token, try to refresh
    if (refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken)

      if (refreshResult.success && refreshResult.tokens) {
        // Create response with refreshed tokens and continue to next middleware
        const response = NextResponse.next()
        setAuthCookies(response, refreshResult.tokens.accessToken, refreshResult.tokens.refreshToken)
        return response
      }
    }

    // No valid tokens, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
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
