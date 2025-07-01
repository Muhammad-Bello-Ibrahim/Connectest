import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import Club from '@/lib/models/Club'

export async function GET(req: NextRequest) {
  await connectDB()

  try {
    const cookie = req.cookies.get('connectrix-token')?.value
    if (!cookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(cookie)
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    const user = await User.findById(payload.id).populate('clubs')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      clubs: user.clubs,
    })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
