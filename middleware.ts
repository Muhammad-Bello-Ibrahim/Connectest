// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!)

const protectedRoutes = ["/dashboard", "/dashboard/admin", "/dashboard/dean"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("connectrix-token")?.value

  if (!token) return NextResponse.redirect(new URL("/login", request.url))

  try {
    const { payload }: any = await jwtVerify(token, getJwtSecret())

    if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (pathname.startsWith("/dashboard/dean") && payload.role !== "dean") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
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
    "/dashboard/dean/:path*",
    "/clubs/:clubId/manage/:path*"
  ],
}
// This middleware checks if the user is authenticated and authorized to access protected routes.
// If not, it redirects them to the login page or the appropriate dashboard based on their role