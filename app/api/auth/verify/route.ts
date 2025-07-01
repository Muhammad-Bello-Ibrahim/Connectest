// File: app/api/auth/verify/route.ts
import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("connectrix-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload }: any = await jwtVerify(token, secret)

    return NextResponse.json({
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    })
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}
