import { NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/utils/audit"
import { getServerSession } from "next-auth"

export async function GET(req: Request) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { searchParams } = new URL(req.url)
    
    const filters = {
      userId: searchParams.get("userId") || undefined,
      action: searchParams.get("action") || undefined,
      targetType: searchParams.get("targetType") || undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100,
      skip: searchParams.get("skip") ? parseInt(searchParams.get("skip")!) : 0,
    }

    const { logs, total } = await getAuditLogs(filters)

    return NextResponse.json({
      logs,
      total,
      page: Math.floor(filters.skip / filters.limit) + 1,
      pageSize: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    })
  } catch (error: any) {
    console.error("Audit logs fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
