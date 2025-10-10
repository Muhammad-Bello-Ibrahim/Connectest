import { NextResponse } from "next/server"
import { getErrorLogs, getErrorStats } from "@/lib/utils/errorLogger"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // If requesting stats
    if (searchParams.get("stats") === "true") {
      const stats = await getErrorStats()
      return NextResponse.json(stats)
    }

    const filters = {
      errorType: searchParams.get("errorType") || undefined,
      severity: searchParams.get("severity") || undefined,
      resolved: searchParams.get("resolved") ? searchParams.get("resolved") === "true" : undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100,
      skip: searchParams.get("skip") ? parseInt(searchParams.get("skip")!) : 0,
    }

    const { errors, total } = await getErrorLogs(filters)

    return NextResponse.json({
      errors,
      total,
      page: Math.floor(filters.skip / filters.limit) + 1,
      pageSize: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    })
  } catch (error: any) {
    console.error("Error logs fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch error logs" },
      { status: 500 }
    )
  }
}
