import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '@/lib/models/User'
import {connectDB} from '@/lib/db'
import { generateTokens, setAuthCookies } from '@/lib/auth'

// Input validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(req: NextRequest) {
  await connectDB()
  
  try {
    const body = await req.json()
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.issues
      }, { status: 400 })
    }

    const { email, password } = validationResult.data
    
    // Find user by email with role=club (case insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      role: 'club'
    }).select('+password')

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const tokens = await generateTokens({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    })

    // Create response with user object (matching the auth provider's expected format)
    const response = NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    })

    // Set auth cookies
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken)

    return response

  } catch (error: any) {
    console.error('CLUB LOGIN ERROR:', error)
    return NextResponse.json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
