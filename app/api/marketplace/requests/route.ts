import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import MarketplaceListing from "@/lib/models/MarketplaceListing";
import MarketplaceRequest from "@/lib/models/MarketplaceRequest";
import Vendor from "@/lib/models/Vendor";
import { currentUser } from "@/lib/server-user";

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const vendor = await Vendor.findOne({ owner: user._id });
  if (!vendor) return NextResponse.json({ requests: [] });
  const requests = await MarketplaceRequest.find({ vendor: vendor._id })
    .populate("requester", "name email").populate("listing", "title kind")
    .sort({ createdAt: -1 }).limit(100);
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const user = await currentUser(request);
  if (!user || user.role !== "student") return NextResponse.json({ error: "Student login required" }, { status: 403 });
  const result = z.object({ listingId: z.string(), message: z.string().trim().min(5).max(500) }).strict()
    .safeParse(await request.json().catch(() => null));
  if (!result.success || !mongoose.isValidObjectId(result.data.listingId)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const listing = await MarketplaceListing.findOne({ _id: result.data.listingId, status: "active" });
  if (!listing) return NextResponse.json({ error: "Listing unavailable" }, { status: 404 });
  const vendor = await Vendor.findOne({ _id: listing.vendor, status: "approved" });
  if (!vendor || String(vendor.owner) === String(user._id)) return NextResponse.json({ error: "Request not permitted" }, { status: 403 });
  try {
    const inquiry = await MarketplaceRequest.create({ listing: listing._id, vendor: vendor._id, requester: user._id, message: result.data.message });
    return NextResponse.json({ request: inquiry, message: "Request sent. No payment was taken." }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return NextResponse.json({ error: "You already inquired about this listing" }, { status: 409 });
    throw error;
  }
}
