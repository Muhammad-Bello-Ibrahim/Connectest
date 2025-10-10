import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import EmailCampaign from "@/lib/models/EmailCampaign"
import User from "@/lib/models/User"
import { createAuditLog } from "@/lib/utils/audit"

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")

    const query: any = {}
    if (status) query.status = status

    const [campaigns, total] = await Promise.all([
      EmailCampaign.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      EmailCampaign.countDocuments(query),
    ])

    return NextResponse.json({
      campaigns,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error("Campaigns fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    
    // Calculate recipient count
    let recipientCount = 0
    const query: any = { status: "active" }
    
    if (body.recipients.type === "all") {
      recipientCount = await User.countDocuments(query)
    } else if (body.recipients.type === "custom") {
      recipientCount = body.recipients.filters.userIds?.length || 0
    } else {
      if (body.recipients.filters.role) query.role = body.recipients.filters.role
      if (body.recipients.filters.faculty) query.faculty = body.recipients.filters.faculty
      if (body.recipients.filters.department) query.department = body.recipients.filters.department
      if (body.recipients.filters.state) query.state = body.recipients.filters.state
      
      recipientCount = await User.countDocuments(query)
    }

    const campaign = await EmailCampaign.create({
      ...body,
      stats: {
        totalRecipients: recipientCount,
      },
    })

    // Log audit
    await createAuditLog({
      userId: body.createdBy,
      userEmail: "admin@system.com",
      action: "bulk_operation",
      targetType: "system",
      details: {
        operation: "campaign_created",
        campaignId: campaign._id,
        name: campaign.name,
        recipientCount,
      },
    })

    return NextResponse.json({
      campaign,
      message: "Campaign created successfully",
    })
  } catch (error: any) {
    console.error("Campaign creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create campaign" },
      { status: 500 }
    )
  }
}
