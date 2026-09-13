import mongoose, { Schema, models, model } from "mongoose";

const CampusContentSchema = new Schema({
  kind: { type: String, enum: ["place", "resource"], required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, trim: true, maxlength: 60 },
  locationLabel: { type: String, trim: true, maxlength: 150 },
  mapX: { type: Number, min: 0, max: 100 },
  mapY: { type: Number, min: 0, max: 100 },
  url: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ["published", "hidden"], default: "published" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

CampusContentSchema.index({ kind: 1, status: 1, createdAt: -1 });
export default models.CampusContent || model("CampusContent", CampusContentSchema);
