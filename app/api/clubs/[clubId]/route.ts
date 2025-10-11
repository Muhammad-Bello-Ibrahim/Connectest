import { NextRequest, NextResponse } from "next/server"
import Club from "@/lib/models/Club"
import User from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  await connectDB()

  try {
    const { clubId } = params

    if (!clubId) {
      return NextResponse.json(
        { error: "Club ID is required" },
        { status: 400 }
      )
    }

    // Get authentication token
    const cookie = req.cookies.get("connectrix-token")?.value
    let userId: string | null = null

    if (cookie) {
      const payload = await verifyToken(cookie)
      if (payload && payload.id) {
        userId = typeof payload.id === "string" ? payload.id : String(payload.id)
      }
    }

    // Find the club and populate faculty and department
    const club = await Club.findById(clubId)
      .populate('faculty', 'code name')
      .populate('department', 'code name')
      .select("-__v")

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    // Check if user is a member (if authenticated)
    let isUserMember = false
    if (userId) {
      const user = await User.findById(userId)
      if (user && user.clubs) {
        isUserMember = user.clubs.some(
          (userClub: any) => userClub.toString() === clubId
        )
      }
    }

    // Return club data with membership status
    return NextResponse.json({
      club: {
        ...club.toObject(),
        isUserMember,
      },
    })
  } catch (error: any) {
    console.error("Error fetching club:", error)
    return NextResponse.json(
      { error: "Failed to fetch club details" },
      { status: 500 }
    )
  }
}
