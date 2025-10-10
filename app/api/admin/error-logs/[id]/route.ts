import { NextResponse } from "next/server"
import { resolveError } from "@/lib/utils/errorLogger"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { resolvedBy, notes } = body

    if (!resolvedBy) {
      return NextResponse.json(
        { error: "resolvedBy is required" },
        { status: 400 }
      )
    }

    const error = await resolveError(params.id, resolvedBy, notes)

    if (!error) {
      return NextResponse.json(
        { error: "Error not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ error, message: "Error resolved successfully" })
  } catch (error: any) {
    console.error("Error resolution failed:", error)
    return NextResponse.json(
      { error: "Failed to resolve error" },
      { status: 500 }
    )
  }
}
