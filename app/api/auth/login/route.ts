import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  await connectDB()

  try {
    const { userId, password } = await req.json()

    if (!userId || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await User.findOne({
      $or: [{ email: userId }, { studentId: userId }],
    }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid email/ID or password' },
        { status: 401 }
      )
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set({
      name: 'connectrix-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}