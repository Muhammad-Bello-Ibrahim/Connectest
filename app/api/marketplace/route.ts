import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Vendor from "@/lib/models/Vendor";
import MarketplaceListing from "@/lib/models/MarketplaceListing";
import { connectDB } from "@/lib/db";
import { currentUser } from "@/lib/server-user";
import { canPublishListing } from "@/lib/v2-rules";

const listingInput = z.object({
  kind: z.enum(["product", "service", "opportunity"]),
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(2000),
  price: z.number().min(0).max(100000000),
  imageUrl: z.union([z.url().startsWith("https://"), z.literal("")]).optional(),
}).strict().refine(x => x.kind === "opportunity" ? x.price === 0 : x.price > 0, { message: "Price must match listing type" });

export async function GET(request: NextRequest) {
  await connectDB();
  if (request.nextUrl.searchParams.get("mine") === "1") {
    const user = await currentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const vendor = await Vendor.findOne({ owner: user._id });
    if (!vendor) return NextResponse.json({ listings: [] });
    const listings = await MarketplaceListing.find({ vendor: vendor._id }).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ listings });
  }
  const kind = request.nextUrl.searchParams.get("kind");
  const filter: Record<string, unknown> = { status: "active" };
  if (["product", "service", "opportunity"].includes(kind || "")) filter.kind = kind;
  const listings = await MarketplaceListing.find(filter)
    .populate({ path: "vendor", select: "businessName status", match: { status: "approved" } })
    .sort({ createdAt: -1 }).limit(60).lean();
  return NextResponse.json({ listings: listings.filter(x => x.vendor) });
}

export async function POST(request: NextRequest) {
  const user = await currentUser(request);
  if (!user || user.role !== "student") return NextResponse.json({ error: "Student login required" }, { status: 403 });
  const vendor = await Vendor.findOne({ owner: user._id });
  if (!canPublishListing(vendor, String(user._id))) return NextResponse.json({ error: "Approved vendor required" }, { status: 403 });
  const result = listingInput.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid listing", details: result.error.issues }, { status: 400 });
  const listing = await MarketplaceListing.create({ ...result.data, vendor: vendor._id });
  return NextResponse.json({ listing }, { status: 201 });
}
