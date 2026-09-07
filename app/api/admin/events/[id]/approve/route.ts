import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Event from "@/lib/models/Event"
import { createAuditLog } from "@/lib/utils/audit"
import { requireAdmin } from "@/lib/admin-auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const body = await req.json()
    const { approved } = body
    const { id } = await params

    const event = await Event.findByIdAndUpdate(
      id,
      {
        isApproved: approved,
        approvedBy: approved ? auth.payload.id : null,
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

    // Log audit. Note: "event_approved"/"event_rejected" are not valid
    // values in the AuditLog schema's action enum, so we log this as
    // "event_updated" and record the approval outcome in details instead.
    await createAuditLog({
      userId: auth.payload.id,
      userEmail: auth.payload.email || "unknown",
      action: "event_updated",
      targetType: "event",
      targetId: event._id.toString(),
      details: { title: event.title, approved },
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
