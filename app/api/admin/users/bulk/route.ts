import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import { createAuditLog } from "@/lib/utils/audit"
import bcrypt from "bcryptjs"

// Bulk import users from CSV
export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { users, adminId } = body

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "Users array is required" },
        { status: 400 }
      )
    }

    const results = {
      success: [],
      failed: [],
    }

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email })
        if (existingUser) {
          results.failed.push({
            email: userData.email,
            reason: "User already exists",
          })
          continue
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password || "defaultPassword123", 10)

        // Create user
        const user = await User.create({
          ...userData,
          password: hashedPassword,
        })

        results.success.push({
          email: user.email,
          name: user.name,
        })

        // Log audit
        await createAuditLog({
          userId: adminId,
          userEmail: "admin@system.com",
          action: "user_created",
          targetType: "user",
          targetId: user._id.toString(),
          details: { name: user.name, email: user.email, bulk: true },
        })
      } catch (error: any) {
        results.failed.push({
          email: userData.email,
          reason: error.message,
        })
      }
    }

    return NextResponse.json({
      message: "Bulk import completed",
      results,
      total: users.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
    })
  } catch (error: any) {
    console.error("Bulk import error:", error)
    return NextResponse.json(
      { error: "Failed to import users" },
      { status: 500 }
    )
  }
}

// Bulk export users
export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    const query: any = {}
    if (role) query.role = role
    if (status) query.status = status

    const users = await User.find(query)
      .select("name email role faculty department state religion status createdAt")
      .lean()

    // Convert to CSV format
    const csvData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Faculty: user.faculty || "",
      Department: user.department || "",
      State: user.state || "",
      Religion: user.religion || "",
      Status: user.status,
      "Created At": new Date(user.createdAt).toISOString(),
    }))

    return NextResponse.json({
      users: csvData,
      total: users.length,
    })
  } catch (error: any) {
    console.error("Bulk export error:", error)
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    )
  }
}
