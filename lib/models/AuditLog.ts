import mongoose from "mongoose"

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "user_created",
        "user_updated",
        "user_deleted",
        "user_activated",
        "user_deactivated",
        "club_created",
        "club_updated",
        "club_deleted",
        "event_created",
        "event_updated",
        "event_deleted",
        "settings_updated",
        "bulk_operation",
        "login",
        "logout",
        "password_reset",
        "role_changed",
        "other",
      ],
    },
    targetType: {
      type: String,
      enum: ["user", "club", "event", "post", "comment", "system", "other"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failure", "pending"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
auditLogSchema.index({ userId: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })
auditLogSchema.index({ targetType: 1, targetId: 1 })
auditLogSchema.index({ createdAt: -1 })

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema)

export default AuditLog
