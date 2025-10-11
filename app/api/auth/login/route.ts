import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '@/lib/models/User'
import {connectDB} from '@/lib/db'
import { generateTokens, setAuthCookies } from '@/lib/auth'

// Input validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email or Student ID is required').max(100),
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

    const { email, password } = validationResult.data
    // Sanitize email input - trim whitespace and normalize case for email
    const sanitizedEmail = email.trim()
    // Find user without populating clubs to avoid Club model registration issues
    const user = await User.findOne({
      $or: [
        { email: sanitizedEmail.toLowerCase() },
        { studentId: sanitizedEmail.toUpperCase() }
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

    // Generate both access and refresh tokens
    const tokens = await generateTokens({
      id: user._id.toString(),
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

    // Set both tokens as cookies
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return res
  } catch (err: any) {
    console.error("LOGIN ERROR:", err)
    return NextResponse.json({
      error: 'Server error'
    }, { status: 500 })
  }
}
