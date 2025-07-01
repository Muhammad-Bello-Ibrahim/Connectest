import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Club from "@/lib/models/Club"
import { SignJWT } from "jose"

export async function POST(req: Request) {
  await connectDB()

  try {
    const {
      name,
      email,
      studentId,
      password,
      faculty,
      department,
      state,
      religion,
    } = await req.json()

    if (!email || !password || !studentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      studentId,
      password: hashedPassword,
      faculty,
      department,
      state,
      religion,
      role: "student",
    })

    const matchingClubs = await Club.find({
      $or: [
        { type: "faculty", faculty },
        { type: "department", faculty, department },
        { type: "state", state },
        { type: "religion", religion },
        { type: "general" },
      ],
    })

    const clubIds = matchingClubs.map((club) => club._id)
    newUser.clubs = clubIds
    await newUser.save()

    const token = await new SignJWT({
      id: newUser._id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!))

    const res = NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        clubs: newUser.clubs,
      },
    })

    res.cookies.set({
      name: "connectrix-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (err) {
    console.error("Registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
