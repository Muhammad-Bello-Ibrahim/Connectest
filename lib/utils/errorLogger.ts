import ErrorLog from "@/lib/models/ErrorLog"
import { connectDB } from "@/lib/db"

interface ErrorLogData {
  errorType: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  stack?: string
  endpoint?: string
  method?: string
  statusCode?: number
  userId?: string
  ipAddress?: string
  userAgent?: string
  requestBody?: any
}

export async function logError(data: ErrorLogData) {
  try {
    await connectDB()
    
    const errorLog = await ErrorLog.create(data)
    
    // If critical, you could send alerts here (email, Slack, etc.)
    if (data.severity === "critical") {
      console.error("CRITICAL ERROR:", data.message)
      // TODO: Send alert notification
    }
    
    return errorLog
  } catch (error) {
    console.error("Failed to log error:", error)
    return null
  }
}

export async function getErrorLogs(filters: {
  errorType?: string
  severity?: string
  resolved?: boolean
  startDate?: Date
  endDate?: Date
  limit?: number
  skip?: number
}) {
  try {
    await connectDB()
    
    const query: any = {}
    
    if (filters.errorType) query.errorType = filters.errorType
    if (filters.severity) query.severity = filters.severity
    if (filters.resolved !== undefined) query.resolved = filters.resolved
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {}
      if (filters.startDate) query.createdAt.$gte = filters.startDate
      if (filters.endDate) query.createdAt.$lte = filters.endDate
    }
    
    const errors = await ErrorLog.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100)
      .skip(filters.skip || 0)
      .populate("userId", "name email")
      .populate("resolvedBy", "name email")
      .lean()
    
    const total = await ErrorLog.countDocuments(query)
    
    return { errors, total }
  } catch (error) {
    console.error("Failed to get error logs:", error)
    return { errors: [], total: 0 }
  }
}

export async function resolveError(errorId: string, resolvedBy: string, notes?: string) {
  try {
    await connectDB()
    
    const error = await ErrorLog.findByIdAndUpdate(
      errorId,
      {
        resolved: true,
        resolvedBy,
        resolvedAt: new Date(),
        notes,
      },
      { new: true }
    )
    
    return error
  } catch (error) {
    console.error("Failed to resolve error:", error)
    return null
  }
}

export async function getErrorStats() {
  try {
    await connectDB()
    
    const [total, unresolved, bySeverity, byType] = await Promise.all([
      ErrorLog.countDocuments(),
      ErrorLog.countDocuments({ resolved: false }),
      ErrorLog.aggregate([
        { $group: { _id: "$severity", count: { $sum: 1 } } },
      ]),
      ErrorLog.aggregate([
        { $group: { _id: "$errorType", count: { $sum: 1 } } },
      ]),
    ])
    
    return {
      total,
      unresolved,
      bySeverity,
      byType,
    }
  } catch (error) {
    console.error("Failed to get error stats:", error)
    return null
  }
}
