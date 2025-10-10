import mongoose from "mongoose"

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "post_created",
        "post_updated",
        "post_deleted",
        "comment_created",
        "club_joined",
        "club_left",
        "event_attended",
        "profile_updated",
        "password_changed",
        "other",
      ],
    },
    description: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    device: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
activityLogSchema.index({ userId: 1, createdAt: -1 })
activityLogSchema.index({ activityType: 1, createdAt: -1 })
activityLogSchema.index({ createdAt: -1 })

// TTL index to auto-delete logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 })

const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema)

export default ActivityLog
