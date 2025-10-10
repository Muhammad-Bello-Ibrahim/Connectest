import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import Club from "@/lib/models/Club"
// import Event from "@/lib/models/Event"

export async function GET(req: Request) {
  try {
    await connectDB()

    // Get counts
    const [totalUsers, totalClubs] = await Promise.all([
      User.countDocuments(),
      Club.countDocuments(),
    ])

    // Placeholder for events (uncomment when Event model is ready)
    const totalEvents = 0
    const activeEvents = 0

    // Get pending approvals (you can customize this based on your schema)
    const pendingApprovals = 0 // Placeholder

    return NextResponse.json({
      totalUsers,
      totalClubs,
      activeEvents,
      pendingApprovals,
      totalEvents,
    })
  } catch (error: any) {
    console.error("Stats fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
