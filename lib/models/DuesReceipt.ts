import mongoose, { Schema, models, model } from "mongoose";

const DuesReceiptSchema = new Schema({
  receiptNumber: { type: String, required: true, unique: true },
  club: { type: Schema.Types.ObjectId, ref: "Club", required: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  period: { type: String, required: true, trim: true, maxlength: 80 },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "NGN" },
  method: { type: String, enum: ["cash"], required: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receivedAt: { type: Date, default: Date.now },
}, { timestamps: true });

DuesReceiptSchema.index({ club: 1, student: 1, period: 1 }, { unique: true });
export default models.DuesReceipt || model("DuesReceipt", DuesReceiptSchema);
