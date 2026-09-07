import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Event from "@/lib/models/Event"
import { createAuditLog } from "@/lib/utils/audit"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const event = await Event.findById((await params).id)
      .populate("clubId", "name abbreviation logo")
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .populate("attendees.userId", "name email avatar")
      .lean()

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error("Event fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const body = await req.json()
    const { id } = await params
    const event = await Event.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Log audit
    await createAuditLog({
      userId: auth.payload.id,
      userEmail: auth.payload.email || "unknown",
      action: "event_updated",
      targetType: "event",
      targetId: event._id.toString(),
      details: { title: event.title, changes: body },
    })

    return NextResponse.json({ event, message: "Event updated successfully" })
  } catch (error: any) {
    console.error("Event update error:", error)
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
    await connectDB()

    const { id } = await params
    const event = await Event.findByIdAndDelete(id)

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Log audit
    await createAuditLog({
      userId: auth.payload.id,
      userEmail: auth.payload.email || "unknown",
      action: "event_deleted",
      targetType: "event",
      targetId: id,
      details: { title: event.title },
    })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error: any) {
    console.error("Event deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    )
  }
}
