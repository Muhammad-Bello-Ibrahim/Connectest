import { NextRequest, NextResponse } from 'next/server'
import { verifyApiAuth } from '@/lib/auth'
import User from '@/lib/models/User'
import connectDB from '@/lib/db'

// Fields to check for profile completeness
const PROFILE_FIELDS = [
  'name',
  'studentId', 
  'email',
  'state',
  'religion',
  'avatar',
  'address',
  'phone',
  'gender',
  'localGovt'
]

function calculateProfileCompleteness(user: Record<string, unknown>) {
  const missingFields: string[] = []
  let filledCount = 0
  
  for (const field of PROFILE_FIELDS) {
    const value = user[field]
    
    // Check if field has meaningful value
    if (!value || 
        (typeof value === 'string' && value.trim() === '') ||
        (field === 'email' && value.includes('@student.temp'))) {
      missingFields.push(field)
    } else {
      filledCount++
    }
  }
  
  const percent = Math.round((filledCount / PROFILE_FIELDS.length) * 100)
  
  return {
    percent,
    missing: missingFields
  }
}

export async function GET(req: NextRequest) {
  await connectDB()
  
  try {
    // Verify authentication
    const authResult = await verifyApiAuth(req)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Fetch full user data
    const user = await User.findById(authResult.user.id)
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 })
    }

    // Calculate profile completeness
    const completeness = calculateProfileCompleteness(user)

    // Prepare user response (excluding sensitive data)
    const userResponse = {
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
      facultyFull: user.facultyFull,
      department: user.department,
      departmentFull: user.departmentFull,
      bio: user.bio,
      avatar: user.avatar,
    }

    return NextResponse.json({
      user: userResponse,
      completeness
    })
  } catch (err: unknown) {
    console.error("PROFILE API ERROR:", err)
    return NextResponse.json({ 
      error: 'Server error'
    }, { status: 500 })
  }
}