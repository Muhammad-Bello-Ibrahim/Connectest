import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Vendor from "@/lib/models/Vendor";
import { currentUser } from "@/lib/server-user";

const application = z.object({
  businessName: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(500),
  address: z.string().trim().min(8).max(200),
  category: z.enum(["products", "services", "both"]),
}).strict();

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (request.nextUrl.searchParams.get("review") === "1") {
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const vendors = await Vendor.find({ status: "pending" }).populate("owner", "name email").sort({ createdAt: 1 }).limit(100);
    return NextResponse.json({ vendors });
  }
  const vendor = await Vendor.findOne({ owner: user._id });
  return NextResponse.json({ vendor });
}

export async function POST(request: NextRequest) {
  const user = await currentUser(request);
  if (!user || user.role !== "student") return NextResponse.json({ error: "Student login required" }, { status: 403 });
  const result = application.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid business details" }, { status: 400 });
  const existing = await Vendor.findOne({ owner: user._id });
  if (existing) return NextResponse.json({ error: "Application already exists" }, { status: 409 });
  const vendor = await Vendor.create({ ...result.data, owner: user._id });
  return NextResponse.json({ vendor, message: "Application submitted for review" }, { status: 201 });
}
