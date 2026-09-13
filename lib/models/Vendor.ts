import mongoose, { Schema, models, model } from "mongoose";

const VendorSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  address: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, enum: ["products", "services", "both"], required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending" },
  // References only. Never store NIN, BVN, bank account numbers, or raw videos here.
  identityReviewReference: { type: String, select: false, maxlength: 120 },
  premisesReviewReference: { type: String, select: false, maxlength: 120 },
  identityChecked: { type: Boolean, default: false },
  premisesChecked: { type: Boolean, default: false },
  payoutNameMatched: { type: Boolean, default: false },
  payoutProviderReference: { type: String, select: false, maxlength: 120 },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
}, { timestamps: true });

VendorSchema.index({ status: 1, createdAt: -1 });
export default models.Vendor || model("Vendor", VendorSchema);
