import { NextRequest, NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/utils/audit"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authorized) return auth.response

  try {
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
