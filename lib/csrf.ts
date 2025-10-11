import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

/**
 * Set CSRF token in response cookies
 */
export function setCsrfToken(response: NextResponse, token: string) {
  response.cookies.set("csrf-token", token, {
    httpOnly: false, // Needs to be accessible via JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

/**
 * Get CSRF token from request
 */
export function getCsrfToken(request: NextRequest): string | undefined {
  return request.cookies.get("csrf-token")?.value
}

/**
 * Validate CSRF token from request headers
 */
export function validateCsrfToken(request: NextRequest, token: string): boolean {
  const cookieToken = getCsrfToken(request)
  return cookieToken === token && token.length > 0
}

/**
 * CSRF middleware for API routes
 */
export function withCsrfProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Skip CSRF protection for GET, HEAD, OPTIONS
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return handler(req)
    }

    // Check for CSRF token in headers
    const csrfToken = req.headers.get("x-csrf-token") || req.headers.get("csrf-token")

    if (!csrfToken || !validateCsrfToken(req, csrfToken)) {
      return NextResponse.json(
        { error: "CSRF token validation failed" },
        { status: 403 }
      )
    }

    return handler(req)
  }
}
