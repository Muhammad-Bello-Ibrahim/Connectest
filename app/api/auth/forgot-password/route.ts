import { NextResponse } from "next/server"
import User from "@/lib/models/User"
import {connectDB} from "@/lib/db"
import { SignJWT } from "jose"
import { sendMail } from "@/lib/server-mail" // <-- FIXED: import from server-mail

const RESET_SECRET = process.env.JWT_SECRET!
const RESET_EXPIRE_MINUTES = 15;

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: "No user with that email" }, { status: 404 })

    // Create a short-lived JWT
    const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${RESET_EXPIRE_MINUTES}m`)
      .sign(new TextEncoder().encode(RESET_SECRET))

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    await sendMail({
      to: email,
      subject: "Password Reset",
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in ${RESET_EXPIRE_MINUTES} minutes.</p>`
    })

    return NextResponse.json({ message: "Reset link sent if email exists." })
  } catch (err: any) {
    console.error(err); // Add this line
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
