import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Event from "@/lib/models/Event"
import { createAuditLog } from "@/lib/utils/audit"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const isApproved = searchParams.get("isApproved")
    const clubId = searchParams.get("clubId")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")

    const query: any = {}
    if (status) query.status = status
    if (isApproved !== null && isApproved !== undefined) query.isApproved = isApproved === "true"
    if (clubId) query.clubId = clubId

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate("clubId", "name abbreviation")
        .populate("createdBy", "name email")
        .populate("approvedBy", "name email")
        .sort({ date: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Event.countDocuments(query),
    ])

    return NextResponse.json({
      events,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error("Events fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const body = await req.json()
    const event = await Event.create(body)

    // Log audit
    await createAuditLog({
      userId: auth.payload.id,
      userEmail: auth.payload.email || "unknown",
      action: "event_created",
      targetType: "event",
      targetId: event._id.toString(),
      details: { title: event.title },
    })

    return NextResponse.json({ event, message: "Event created successfully" })
  } catch (error: any) {
    console.error("Event creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    )
  }
}
