import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { z } from "zod";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import DuesReceipt from "@/lib/models/DuesReceipt";
import { currentUser } from "@/lib/server-user";
import { canIssueDuesReceipt } from "@/lib/v2-rules";

export async function GET(request: NextRequest) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clubId = request.nextUrl.searchParams.get("clubId");
  if (clubId) {
    if (!mongoose.isValidObjectId(clubId)) return NextResponse.json({ error: "Invalid club" }, { status: 400 });
    const club = await Club.findById(clubId).select("email");
    if (!club || (user.role !== "admin" && (user.role !== "club" || club.email !== user.email))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const receipts = await DuesReceipt.find({ club: clubId }).populate("student", "name studentId").sort({ receivedAt: -1 }).limit(200);
    const members = await User.find({ clubs: clubId, role: "student" }).select("_id name studentId").sort({ name: 1 }).limit(500);
    return NextResponse.json({ receipts, members });
  }
  if (user.role !== "student") return NextResponse.json({ error: "Student login required" }, { status: 403 });
  const receipts = await DuesReceipt.find({ student: user._id }).populate("club", "name").sort({ receivedAt: -1 }).limit(100);
  return NextResponse.json({ receipts });
}

export async function POST(request: NextRequest) {
  const user = await currentUser(request);
  if (!user || !["club", "admin"].includes(user.role)) return NextResponse.json({ error: "Club officer required" }, { status: 403 });
  const result = z.object({
    clubId: z.string(), studentId: z.string(),
    period: z.string().trim().min(3).max(80),
    receivedInPerson: z.literal(true),
  }).strict().safeParse(await request.json().catch(() => null));
  if (!result.success || !mongoose.isValidObjectId(result.data.clubId) || !mongoose.isValidObjectId(result.data.studentId)) {
    return NextResponse.json({ error: "Invalid receipt details" }, { status: 400 });
  }
  const club = await Club.findById(result.data.clubId);
  const member = club ? await User.findOne({ _id: result.data.studentId, role: "student", clubs: club._id }) : null;
  if (!canIssueDuesReceipt(club, user, member, result.data.clubId, result.data.period)) {
    return NextResponse.json({ error: "Club, officer, membership, or period is not eligible for this receipt" }, { status: 403 });
  }
  try {
    const receipt = await DuesReceipt.create({
      receiptNumber: `CRX-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`,
      club: club._id, student: member._id, period: result.data.period,
      amount: club.membershipFeeAmount, method: "cash", recordedBy: user._id,
    });
    return NextResponse.json({ receipt, message: "In-person payment recorded and receipt issued" }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return NextResponse.json({ error: "A receipt already exists for this student and period" }, { status: 409 });
    throw error;
  }
}
