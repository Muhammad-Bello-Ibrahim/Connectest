import { NextRequest, NextResponse } from "next/server"
import { refreshAccessToken, setAuthCookies, getAuthTokens } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookies (more secure than request body)
    const { refreshToken } = getAuthTokens(req)

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      )
    }

    const result = await refreshAccessToken(refreshToken)

    if (!result.success || !result.tokens) {
      return NextResponse.json(
        { error: result.error || "Failed to refresh token" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      message: "Token refreshed successfully",
      user: result.user
    })

    // Set new tokens as cookies
    setAuthCookies(response, result.tokens.accessToken, result.tokens.refreshToken)

    return response
  } catch (error) {
    console.error("Refresh token error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
