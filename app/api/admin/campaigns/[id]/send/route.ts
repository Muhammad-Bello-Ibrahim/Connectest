import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import EmailCampaign from "@/lib/models/EmailCampaign"
import User from "@/lib/models/User"
import { createAuditLog } from "@/lib/utils/audit"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const campaign = await EmailCampaign.findById(params.id)

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    if (campaign.status === "sent") {
      return NextResponse.json(
        { error: "Campaign already sent" },
        { status: 400 }
      )
    }

    // Get recipients
    const query: any = { status: "active" }
    
    if (campaign.recipients.type === "custom") {
      query._id = { $in: campaign.recipients.filters.userIds }
    } else if (campaign.recipients.type !== "all") {
      if (campaign.recipients.filters.role) query.role = campaign.recipients.filters.role
      if (campaign.recipients.filters.faculty) query.faculty = campaign.recipients.filters.faculty
      if (campaign.recipients.filters.department) query.department = campaign.recipients.filters.department
      if (campaign.recipients.filters.state) query.state = campaign.recipients.filters.state
    }

    const users = await User.find(query).select("email name").lean()

    // Update campaign status
    campaign.status = "sending"
    await campaign.save()

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // For now, simulate sending
    const results = {
      sent: users.length,
      failed: 0,
    }

    // Update campaign with results
    campaign.status = "sent"
    campaign.sentAt = new Date()
    campaign.stats.sent = results.sent
    campaign.stats.delivered = results.sent
    await campaign.save()

    // Log audit
    await createAuditLog({
      userId: campaign.createdBy.toString(),
      userEmail: "admin@system.com",
      action: "bulk_operation",
      targetType: "system",
      details: {
        operation: "campaign_sent",
        campaignId: campaign._id,
        recipientCount: results.sent,
      },
    })

    return NextResponse.json({
      message: "Campaign sent successfully",
      results,
    })
  } catch (error: any) {
    console.error("Campaign send error:", error)
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    )
  }
}
