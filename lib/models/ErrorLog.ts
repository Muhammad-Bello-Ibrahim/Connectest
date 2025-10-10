import mongoose from "mongoose"

const errorLogSchema = new mongoose.Schema(
  {
    errorType: {
      type: String,
      required: true,
      enum: ["api_error", "database_error", "validation_error", "auth_error", "system_error", "other"],
    },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    message: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
    },
    endpoint: {
      type: String,
    },
    method: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    requestBody: {
      type: mongoose.Schema.Types.Mixed,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
errorLogSchema.index({ errorType: 1, createdAt: -1 })
errorLogSchema.index({ severity: 1, resolved: 1 })
errorLogSchema.index({ createdAt: -1 })
errorLogSchema.index({ resolved: 1 })

// TTL index to auto-delete resolved errors older than 30 days
errorLogSchema.index(
  { resolvedAt: 1 },
  { expireAfterSeconds: 2592000, partialFilterExpression: { resolved: true } }
)

const ErrorLog = mongoose.models.ErrorLog || mongoose.model("ErrorLog", errorLogSchema)

export default ErrorLog
