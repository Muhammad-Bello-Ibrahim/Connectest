import ActivityLog from "@/lib/models/ActivityLog"
import { connectDB } from "@/lib/db"

interface ActivityLogData {
  userId: string
  activityType: string
  description?: string
  metadata?: any
  ipAddress?: string
  userAgent?: string
  device?: string
  location?: string
}

export async function logActivity(data: ActivityLogData) {
  try {
    await connectDB()
    
    const activity = await ActivityLog.create(data)
    return activity
  } catch (error) {
    console.error("Failed to log activity:", error)
    return null
  }
}

export async function getUserActivities(userId: string, limit = 50) {
  try {
    await connectDB()
    
    const activities = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    
    return activities
  } catch (error) {
    console.error("Failed to get user activities:", error)
    return []
  }
}

export async function getRecentActivities(limit = 100) {
  try {
    await connectDB()
    
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name email avatar")
      .lean()
    
    return activities
  } catch (error) {
    console.error("Failed to get recent activities:", error)
    return []
  }
}

// Parse user agent to extract device info
export function parseUserAgent(userAgent: string): string {
  if (!userAgent) return "Unknown"
  
  if (userAgent.includes("Mobile")) return "Mobile"
  if (userAgent.includes("Tablet")) return "Tablet"
  return "Desktop"
}
