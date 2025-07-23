import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '@/lib/models/User'
import connectDB from '@/lib/db'
import { signToken } from '@/lib/auth'

// Input validation schema
const loginSchema = z.object({
  userId: z.string().min(1, 'Email or Student ID is required').max(100),
  password: z.string().min(1, 'Password is required').max(128)
})

export async function POST(req: NextRequest) {
  await connectDB()
  try {
    const body = await req.json()
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: validationResult.error.issues 
      }, { status: 400 })
    }

    const { userId, password } = validationResult.data
    // Sanitize userId input - trim whitespace and normalize case for email
    const sanitizedUserId = userId.trim()
    // Find user without populating clubs to avoid Club model registration issues
    const user = await User.findOne({
      $or: [
        { email: sanitizedUserId.toLowerCase() }, 
        { studentId: sanitizedUserId.toUpperCase() }
      ],
    }).select('+password')

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update last login
    try {
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })
    } catch (updateError) {
      console.warn('Failed to update last login:', updateError)
      // Continue with login even if last login update fails
    }

    const token = await signToken({ 
      id: user._id, 
      role: user.role,
      email: user.email,
      name: user.name
    })

    const res = NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        phone: user.phone,
        state: user.state,
        localGovt: user.localGovt,
        address: user.address,
        religion: user.religion,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
        level: user.level,
        faculty: user.faculty,
        department: user.department,
        bio: user.bio,
        avatar: user.avatar,
      },
    })

    // Secure cookie configuration
    res.cookies.set('connectrix-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (err: any) {
    console.error("LOGIN ERROR:", err)
    return NextResponse.json({ 
      error: 'Server error'
    }, { status: 500 })
  }
}
