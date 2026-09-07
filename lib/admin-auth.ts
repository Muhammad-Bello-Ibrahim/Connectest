import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getAuthTokens } from "@/lib/auth"

export interface AdminAuthPayload {
  id: string
  role: string
  email?: string
  name?: string
}

type AdminAuthResult =
  | { authorized: true; payload: AdminAuthPayload }
  | { authorized: false; response: NextResponse }

/**
 * Verifies that the incoming request carries a valid access token for a
 * user with role "admin". Every /api/admin/* route should call this first
 * and return its `response` immediately if `authorized` is false.
 *
 * This exists because Next.js middleware (middleware.ts) only protects
 * page routes under /dashboard/admin/*, NOT API routes under /api/admin/*.
 * Without this check, admin API endpoints are reachable by anyone.
 */
export async function requireAdmin(req: NextRequest): Promise<AdminAuthResult> {
  const { accessToken } = getAuthTokens(req)

  if (!accessToken) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const payload = await verifyToken(accessToken)

  if (!payload || !payload.id) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
    }
  }

  if (payload.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 }),
    }
  }

  return {
    authorized: true,
    payload: {
      id: String(payload.id),
      role: payload.role as string,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
    },
  }
}
