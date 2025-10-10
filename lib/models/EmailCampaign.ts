import mongoose from "mongoose"

const emailCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
    },
    recipients: {
      type: {
        type: String,
        enum: ["all", "role", "faculty", "department", "state", "custom"],
        required: true,
      },
      filters: {
        role: String,
        faculty: String,
        department: String,
        state: String,
        userIds: [mongoose.Schema.Types.ObjectId],
      },
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft",
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    stats: {
      totalRecipients: {
        type: Number,
        default: 0,
      },
      sent: {
        type: Number,
        default: 0,
      },
      delivered: {
        type: Number,
        default: 0,
      },
      opened: {
        type: Number,
        default: 0,
      },
      clicked: {
        type: Number,
        default: 0,
      },
      bounced: {
        type: Number,
        default: 0,
      },
      failed: {
        type: Number,
        default: 0,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
emailCampaignSchema.index({ status: 1, scheduledAt: 1 })
emailCampaignSchema.index({ createdBy: 1, createdAt: -1 })

const EmailCampaign = mongoose.models.EmailCampaign || mongoose.model("EmailCampaign", emailCampaignSchema)

export default EmailCampaign
