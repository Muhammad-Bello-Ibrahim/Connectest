import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import Vendor from "@/lib/models/Vendor";
import { currentUser } from "@/lib/server-user";

const review = z.object({
  decision: z.enum(["approved", "rejected"]),
  identityChecked: z.boolean(),
  premisesChecked: z.boolean(),
  identityReviewReference: z.string().trim().max(120),
  premisesReviewReference: z.string().trim().max(120),
}).strict();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin required" }, { status: 403 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid vendor" }, { status: 400 });
  const result = review.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  if (result.data.decision === "approved" && (!result.data.identityChecked || !result.data.premisesChecked ||
      !/^CASE-[A-Z0-9-]{3,60}$/i.test(result.data.identityReviewReference) ||
      !/^CASE-[A-Z0-9-]{3,60}$/i.test(result.data.premisesReviewReference))) {
    return NextResponse.json({ error: "Both independent review checks and case references are required" }, { status: 400 });
  }
  const { decision, ...checks } = result.data;
  const vendor = await Vendor.findOneAndUpdate(
    { _id: id, status: "pending" },
    { $set: { ...checks, status: decision, reviewedBy: user._id, reviewedAt: new Date() } },
    { new: true, runValidators: true }
  );
  if (!vendor) return NextResponse.json({ error: "Pending application not found" }, { status: 404 });
  return NextResponse.json({ vendor });
}
