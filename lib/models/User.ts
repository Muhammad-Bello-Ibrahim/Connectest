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
  role: "student" | "admin" | "dean";
  level?: string;
  faculty?: string;
  department?: string;
  bio?: string;
  avatar?: string;
  clubs?: any[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: String,
    phone: String,
    state: String,
    localGovt: String,
    address: String,
    religion: String,
    gender: String,
    dob: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin", "dean"], default: "student" },
    level: String,
    faculty: String,
    department: String,
    bio: String,
    avatar: String,
    clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
