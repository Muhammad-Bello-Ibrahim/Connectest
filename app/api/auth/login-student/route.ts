import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import User from '@/lib/models/User'
import connectDB from '@/lib/db'
import { signToken } from '@/lib/auth'
import { assignAndCreateClubsForUser } from '@/lib/utils'

// Faculty and department maps (reused from register route)
const FACULTY_MAP: Record<string, string> = {
  AS: "ARTS AND SOCIAL SCIENCES",
  ED: "EDUCATION",
  LL: "LAW",
  MD: "MEDICINE",
  PH: "PHARMACY",
  SC: "SCIENCE",
};

const DEPARTMENT_MAP: Record<string, string> = {
  AC: "ACCOUNTING",
  AR: "ARCHITECTURE",
  BA: "BUSINESS ADMINISTRATION",
  BF: "BANKING AND FINANCE",
  CR: "CRIMINOLOGY",
  EC: "ECONOMICS",
  ECE: "ECONOMIC EDUCATION",
  EM: "EDUCATIONAL MANAGEMENT",
  EN: "ENGLISH",
  HS: "HISTORY",
  IN: "INTERNATIONAL RELATIONS",
  IR: "ISLAMIC STUDIES",
  LS: "LIBRARY AND INFORMATION SCIENCE",
  PA: "PUBLIC ADMINISTRATION",
  PC: "PEACE STUDIES AND CONFLICT RESOLUTION",
  PS: "POLITICAL SCIENCE",
  PSE: "POLITICAL SCIENCE EDUCATION",
  SG: "SOCIOLOGY",
  BL: "LAW",
  HA: "HUMAN ANATOMY",
  HN: "HUMAN NUTRITION AND DIETETICS",
  HP: "HUMAN PHYSIOLOGY",
  MD: "MEDICINE",
  NS: "NURSING",
  PH: "PHARM D.",
  PHT: "PUBLIC HEALTH",
  PM: "PHARMACOLOGY",
  BC: "BIOCHEMISTRY",
  BH: "BIOTECHNOLOGY",
  BS: "BIOLOGY",
  BT: "BOTANY",
  CH: "CHEMISTRY",
  CS: "COMPUTER SCIENCE",
  ET: "ENVIRONMENTAL TECHNOLOGY",
  GL: "GEOLOGY",
  GS: "GEOGRAPHY",
  MC: "MICROBIOLOGY",
  MT: "MATHEMATICS",
  PV: "PHYSICS",
  PY: "PURE AND APPLIED PHYSICS",
};

// Input validation schema
const studentLoginSchema = z.object({
  name: z.string()
    .min(2, 'Full name is required')
    .max(100, 'Name too long')
    .trim(),
  studentId: z.string()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number too long')
    .refine((val) => {
      // Validate UG20/SCCS/1026 format
      const regex = /^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/i;
      return regex.test(val);
    }, {
      message: 'Registration number must follow format UGYY/FFDD/NNNN (e.g., UG20/SCCS/1026)'
    })
})

export async function POST(req: NextRequest) {
  await connectDB()
  
  try {
    const body = await req.json()
    
    // Validate input
    const validationResult = studentLoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: validationResult.error.issues 
      }, { status: 400 })
    }

    const { name, studentId } = validationResult.data
    
    // Parse faculty and department from studentId
    const match = studentId.toUpperCase().match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d{4}$/)
    if (!match) {
      return NextResponse.json({ 
        error: 'Invalid registration number format' 
      }, { status: 400 })
    }

    const facultyCode = match[1]
    const departmentCode = match[2]
    
    // Resolve faculty and department full names
    const facultyFull = FACULTY_MAP[facultyCode] || facultyCode
    const departmentFull = DEPARTMENT_MAP[departmentCode] || departmentCode

    // Check if user exists by studentId
    let user = await User.findOne({ studentId: studentId.toUpperCase() })
    
    if (user) {
      // User exists - update name if changed
      if (user.name !== name.trim()) {
        user.name = name.trim()
        await user.save()
      }
      
      // Update last login
      try {
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })
      } catch (updateError) {
        console.warn('Failed to update last login:', updateError)
      }
    } else {
      // User does not exist - create new user
      const clubs = await assignAndCreateClubsForUser({
        facultyAbbr: facultyCode,
        facultyFull,
        departmentAbbr: departmentCode,
        departmentFull,
      })

      // Generate a placeholder password (will not be used for student login)
      const placeholderPassword = await bcrypt.hash('student-login-placeholder', 12)

      user = await User.create({
        name: name.trim(),
        studentId: studentId.toUpperCase(),
        faculty: facultyCode,
        facultyFull,
        department: departmentCode,
        departmentFull,
        role: 'student',
        clubs,
        // Set a placeholder email that can be updated later
        email: `${studentId.toLowerCase().replace(/\//g, '-')}@student.temp`,
        // Set a hashed placeholder password
        password: placeholderPassword,
      })

      console.log("New student user created via student login:", {
        name: user.name,
        studentId: user.studentId,
        faculty: user.faculty,
        department: user.department,
        clubsMatched: clubs.length,
      })
    }

    // Sign JWT token
    const token = await signToken({ 
      id: user._id, 
      role: user.role,
      email: user.email,
      name: user.name
    })

    // Prepare user response
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

    const res = NextResponse.json({
      user: userResponse,
    })

    // Set secure cookie
    res.cookies.set('connectrix-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (err: unknown) {
    console.error("STUDENT LOGIN ERROR:", err)
    return NextResponse.json({ 
      error: 'Server error'
    }, { status: 500 })
  }
}