import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import Club from '@/lib/models/Club'
import User from '@/lib/models/User'
import connectDB from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await connectDB()
  try {
    const { userId, password } = await req.json()
    if (!userId || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }
    const user = await User.findOne({
      $or: [{ email: userId }, { studentId: userId }],
    })
      .select('+password')
      .populate('clubs')
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = await signToken({ id: user._id, role: user.role })
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
        // clubs: user.clubs, // optional
      },
    })
    res.cookies.set('connectrix-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error("LOGIN ERROR:", err)
    return NextResponse.json({ error: 'Server error', details: err?.message || err }, { status: 500 })
  }
}