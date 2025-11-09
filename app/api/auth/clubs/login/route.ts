import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import Club from '@/lib/models/Club'
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
    
    // Find club by email (case insensitive)
    const club = await Club.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password')

    if (!club) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, club.password)
    if (!isMatch) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }

    // Update last login
    club.lastLogin = new Date()
    await club.save()

    // Generate tokens
    const tokens = await generateTokens({
      id: club._id.toString(),
      role: 'club',
      email: club.email,
      name: club.name
    })

    // Create response
    const response = NextResponse.json({
      club: {
        _id: club._id,
        name: club.name,
        email: club.email,
        type: club.type,
        members: club.members,
        status: club.status
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
