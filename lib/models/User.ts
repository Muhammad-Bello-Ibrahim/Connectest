import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    phone: String,
    state: String,
    localGovt: String,
    address: String,
    religion: String,
    gender: String,
    dob: Date,
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin", "dean"], default: "student" },

    // ✅ NEW FIELD
    clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
