import mongoose, { Schema, Document } from "mongoose";

export interface IClub extends Document {
  name: string;
  type: "faculty" | "department" | "state" | "religion" | "general";
  faculty?: string;
  department?: string;
  state?: string;
  religion?: string;
}

const ClubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["faculty", "department", "state", "religion", "general"], required: true },
    faculty: String,
    department: String,
    state: String,
    religion: String,
  },
  { timestamps: true }
);

export default mongoose.models.Club || mongoose.model<IClub>("Club", ClubSchema);
// This schema defines the structure of a Club document in MongoDB.
// It includes fields for the club's name, abbreviation, description, logo, type, faculty, department, state, religion, members, and status.