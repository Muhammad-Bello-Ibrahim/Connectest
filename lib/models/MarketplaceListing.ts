import mongoose, { Schema, models, model } from "mongoose";

const MarketplaceListingSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  kind: { type: String, enum: ["product", "service", "opportunity"], required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  price: { type: Number, required: true, min: 0, max: 100000000 },
  imageUrl: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ["active", "paused"], default: "active" },
}, { timestamps: true });

MarketplaceListingSchema.index({ status: 1, kind: 1, createdAt: -1 });
export default models.MarketplaceListing || model("MarketplaceListing", MarketplaceListingSchema);
