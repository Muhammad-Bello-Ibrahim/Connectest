import mongoose from "mongoose"

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["welcome", "notification", "announcement", "reminder", "marketing", "other"],
      default: "other",
    },
    variables: [{
      name: String,
      description: String,
      defaultValue: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
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
emailTemplateSchema.index({ category: 1, isActive: 1 })
emailTemplateSchema.index({ name: "text" })

const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", emailTemplateSchema)

export default EmailTemplate
