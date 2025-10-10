import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
    },
    category: {
      type: String,
      enum: ["workshop", "seminar", "conference", "social", "sports", "cultural", "academic", "other"],
      default: "other",
    },
    image: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    registrationDeadline: {
      type: Date,
    },
    attendees: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
      attended: {
        type: Boolean,
        default: false,
      },
    }],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    tags: [{
      type: String,
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
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
eventSchema.index({ clubId: 1, date: -1 })
eventSchema.index({ date: 1, status: 1 })
eventSchema.index({ status: 1, isApproved: 1 })
eventSchema.index({ title: "text", description: "text" })

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

export default Event
