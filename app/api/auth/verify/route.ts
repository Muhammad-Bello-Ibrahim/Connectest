// File: app/api/auth/verify/route.ts
import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import connectDB from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("connectrix-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload }: any = await jwtVerify(token, secret)

    // Get full user data from database for verification
    await connectDB()
    const user = await User.findById(payload.id).select('-password')
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      faculty: user.faculty,
      department: user.department,
    })
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}
