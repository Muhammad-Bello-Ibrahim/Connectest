import mongoose, { Schema, models, model } from "mongoose";

const MarketplaceRequestSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "MarketplaceListing", required: true },
  requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
}, { timestamps: true });

MarketplaceRequestSchema.index({ vendor: 1, createdAt: -1 });
MarketplaceRequestSchema.index({ listing: 1, requester: 1 }, { unique: true });
export default models.MarketplaceRequest || model("MarketplaceRequest", MarketplaceRequestSchema);
