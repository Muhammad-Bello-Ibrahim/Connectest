import mongoose from "mongoose"

const ClubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    abbreviation: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String }, // optional, can be a URL or file name
    type: {
      type: String,
      enum: ["faculty", "department", "state", "religion", "general"],
      required: true
    },
    faculty: { type: String },
    department: { type: String },
    state: { type: String },
    religion: { type: String },
    members: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "pending"], default: "active" }
  },
  { timestamps: true }
)

export default mongoose.models.Club || mongoose.model("Club", ClubSchema)
// This schema defines the structure of a Club document in MongoDB.
// It includes fields for the club's name, abbreviation, description, logo, type, faculty, department, state, religion, members, and status.