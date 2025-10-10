import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Event from "@/lib/models/Event"
import { createAuditLog } from "@/lib/utils/audit"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await req.json()
    const { approvedBy, approved } = body

    const event = await Event.findByIdAndUpdate(
      params.id,
      {
        isApproved: approved,
        approvedBy: approved ? approvedBy : null,
        approvedAt: approved ? new Date() : null,
        status: approved ? "published" : "draft",
      },
      { new: true }
    )

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Log audit
    await createAuditLog({
      userId: approvedBy,
      userEmail: "admin@system.com", // TODO: Get from session
      action: approved ? "event_approved" : "event_rejected",
      targetType: "event",
      targetId: event._id.toString(),
      details: { title: event.title },
    })

    return NextResponse.json({
      event,
      message: `Event ${approved ? "approved" : "rejected"} successfully`,
    })
  } catch (error: any) {
    console.error("Event approval error:", error)
    return NextResponse.json(
      { error: "Failed to update event approval status" },
      { status: 500 }
    )
  }
}
