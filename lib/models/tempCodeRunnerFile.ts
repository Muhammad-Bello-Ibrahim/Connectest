import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IClub extends Document {
  name: string;
  abbreviation?: string;
  description?: string;
  logo?: string;
  type: string; // e.g. "faculty", "department", "state", "religion", "general"
  faculty?: string;
  department?: string;
  state?: string;
  religion?: string;
  members?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true },
    abbreviation: { type: String },
    description: { type: String },
    logo: { type: String },
    type: { type: String, required: true }, // lowercase: "faculty", "department", etc.
    faculty: { type: String, default: "" },
    department: { type: String, default: "" },
    state: { type: String, default: "" },
    religion: { type: String, default: "" },
    members: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

// Pre-save hook to normalize fields
ClubSchema.pre("save", function (next) {
  if (this.faculty) this.faculty = this.faculty.trim().toUpperCase();
  if (this.department) this.department = this.department.trim().toUpperCase();
  if (this.state) this.state = this.state.trim().toUpperCase();
  if (this.religion) this.religion = this.religion.trim().toUpperCase();
  if (this.type) this.type = this.type.trim().toLowerCase();
  next();
});

const Club = models.Club || model<IClub>("Club", ClubSchema);

export default Club;
// This schema defines the structure of a Club document in MongoDB.
// It includes fields for the club's name, abbreviation, description, logo, type, faculty, department, state, religion, members, and status.