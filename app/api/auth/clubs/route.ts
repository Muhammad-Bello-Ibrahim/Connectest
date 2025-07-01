import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Club from '@/lib/models/Club'

export async function POST(req: Request) {
  await connectDB()

  try {
    const {
      name,
      abbreviation,
      description,
      type,
      faculty,
      department,
      state,
      religion,
      logo
    } = await req.json()

    if (!name || !abbreviation || !description || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newClub = await Club.create({
      name,
      abbreviation,
      description,
      type,
      faculty,
      department,
      state,
      religion,
      logo
    })

    return NextResponse.json(newClub, { status: 201 })
  } catch (err: any) {
    console.error("Club creation error:", err)
    return NextResponse.json({ error: err.message || "Failed to create club" }, { status: 500 })
  }
}
