import { NextResponse } from "next/server"
import User from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import { jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const RESET_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  await connectDB()
  const { token, password, confirmPassword } = await req.json()
  if (!token || !password || !confirmPassword)
    return NextResponse.json({ error: "All fields required" }, { status: 400 })
  if (password !== confirmPassword)
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(RESET_SECRET))
    const userId = payload.id as string
    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    user.password = await bcrypt.hash(password, 10)
    await user.save()
    return NextResponse.json({ message: "Password reset successful" })
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }
}
