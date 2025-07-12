import mongoose, { Schema, Document, models, model } from "mongoose";
import Club from "./Club";

export interface IUser extends Document {
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  state?: string;
  localGovt?: string;
  address?: string;
  religion?: string;
  gender?: string;
  dob?: string;
  password: string;
  role: "student" | "admin" | "club";
  level?: string;
  faculty?: string;
  department?: string;
  bio?: string;
  avatar?: string;
  clubs?: any[];
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    email: { 
      type: String, 
      required: true, 
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    studentId: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 20
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    state: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 50
    },
    localGovt: {
      type: String,
      trim: true,
      maxlength: 50
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200
    },
    religion: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 50
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      lowercase: true
    },
    dob: String,
    password: { 
      type: String, 
      required: true,
      select: false, // Don't include in queries by default
      minlength: 8,
      maxlength: 128
    },
    role: { 
      type: String, 
      enum: ["student", "admin", "club"], 
      default: "student" 
    },
    level: {
      type: String,
      trim: true,
      maxlength: 20
    },
    faculty: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 100
    },
    department: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 100
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    avatar: {
      type: String,
      trim: true,
      maxlength: 255
    },
    clubs: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Club" 
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
  },
  { 
    timestamps: true
  }
);

// Compound indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ studentId: 1 }, { unique: true, sparse: true });
UserSchema.index({ faculty: 1, department: 1 });
UserSchema.index({ state: 1, religion: 1 });
UserSchema.index({ role: 1, isActive: 1 });

// Pre-save middleware for data normalization
UserSchema.pre("save", function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.studentId) this.studentId = this.studentId.toUpperCase().trim();
  if (this.name) this.name = this.name.trim();
  if (this.faculty) this.faculty = this.faculty.toUpperCase().trim();
  if (this.department) this.department = this.department.toUpperCase().trim();
  if (this.state) this.state = this.state.toUpperCase().trim();
  if (this.religion) this.religion = this.religion.toUpperCase().trim();
  if (this.gender) this.gender = this.gender.toLowerCase().trim();
  next();
});

// Instance method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find by email or student ID
UserSchema.statics.findByIdentifier = function(identifier: string) {
  const cleanIdentifier = identifier.trim();
  return this.findOne({
    $or: [
      { email: cleanIdentifier.toLowerCase() },
      { studentId: cleanIdentifier.toUpperCase() }
    ]
  });
};

const User = models.User || model<IUser>("User", UserSchema);
export default User;
