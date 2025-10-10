import AuditLog from "@/lib/models/AuditLog"
import { connectDB } from "@/lib/db"

interface AuditLogData {
  userId: string
  userEmail: string
  action: string
  targetType?: string
  targetId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  status?: "success" | "failure" | "pending"
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await connectDB()
    
    const auditLog = await AuditLog.create({
      userId: data.userId,
      userEmail: data.userEmail,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: data.status || "success",
    })
    
    return auditLog
  } catch (error) {
    console.error("Failed to create audit log:", error)
    // Don't throw - audit logging should not break the main flow
    return null
  }
}

export async function getAuditLogs(filters: {
  userId?: string
  action?: string
  targetType?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  skip?: number
}) {
  try {
    await connectDB()
    
    const query: any = {}
    
    if (filters.userId) query.userId = filters.userId
    if (filters.action) query.action = filters.action
    if (filters.targetType) query.targetType = filters.targetType
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {}
      if (filters.startDate) query.createdAt.$gte = filters.startDate
      if (filters.endDate) query.createdAt.$lte = filters.endDate
    }
    
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 100)
      .skip(filters.skip || 0)
      .populate("userId", "name email")
      .lean()
    
    const total = await AuditLog.countDocuments(query)
    
    return { logs, total }
  } catch (error) {
    console.error("Failed to get audit logs:", error)
    return { logs: [], total: 0 }
  }
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return "unknown"
}
