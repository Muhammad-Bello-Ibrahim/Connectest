import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import CampusContent from "@/lib/models/CampusContent";
import { connectDB } from "@/lib/db";
import { currentUser } from "@/lib/server-user";

const contentInput = z.object({
  kind: z.enum(["place", "resource"]),
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(1000),
  category: z.string().trim().max(60).optional(),
  locationLabel: z.string().trim().max(150).optional(),
  mapX: z.number().min(0).max(100).optional(),
  mapY: z.number().min(0).max(100).optional(),
  url: z.union([z.url().startsWith("https://"), z.literal("")]).optional(),
}).strict();

export async function GET(request: NextRequest) {
  await connectDB();
  const kind = request.nextUrl.searchParams.get("kind");
  if (!kind || !["place", "resource"].includes(kind)) return NextResponse.json({ error: "Kind required" }, { status: 400 });
  const entries = await CampusContent.find({ kind, status: "published" }).sort({ title: 1 }).limit(100).select("-__v");
  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  const user = await currentUser(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin required" }, { status: 403 });
  const result = contentInput.safeParse(await request.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Invalid campus content" }, { status: 400 });
  const entry = await CampusContent.create({ ...result.data, createdBy: user._id });
  return NextResponse.json({ entry }, { status: 201 });
}
