import mongoose, { Schema, models, model, Document } from "mongoose";

export interface IClub extends Document {
  name: string;
  abbreviation?: string;
  description?: string;
  logo?: string;
  email?: string;
  password?: string;
  type: string;
  faculty?: string;
  department?: string;
  state?: string;
  religion?: string;
  members?: number;
  status?: string;
  createdBy?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true },
    abbreviation: { type: String },
    description: { type: String },
    logo: { type: String },
    email: { 
      type: String, 
      unique: true, 
      sparse: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: { 
      type: String,
      select: false, // Don't include in queries by default
      minlength: 8,
      maxlength: 128
    },
    type: { type: String, required: true },
    faculty: { type: String, default: "" },
    department: { type: String, default: "" },
    state: { type: String, default: "" },
    religion: { type: String, default: "" },
    members: { type: Number, default: 0 },
    status: { type: String, default: "active" },
    createdBy: { type: String }, // Admin ID or reference
    role: { type: String, default: "club" }, // For login separation
  },
  { timestamps: true }
);

ClubSchema.pre("save", function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
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