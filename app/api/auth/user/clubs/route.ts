import { NextRequest, NextResponse } from "next/server";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { types } from "mongoose";
export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    const userId = typeof payload.id === "string"
      ? payload.id
      : payload.id?.buffer
        ? Buffer.from(Object.values(payload.id.buffer)).toString("hex")
        : null;
    if (!userId) return NextResponse.json({ error: "Invalid user id in token" }, { status: 403 });
    const user = await User.findById(userId).populate("clubs");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const validClubs = Array.isArray(user.clubs)
      ? user.clubs.filter(Boolean).map((club: any) => ({
          _id: club._id,
          name: club.name,
          type: club.type,
          faculty: club.faculty,
          department: club.department,
          state: club.state,
          religion: club.religion,
        }))
      : [];
    return NextResponse.json({ clubs: validClubs });
  } catch (error) {
    console.error("Error in /api/auth/user/clubs:", error);
    return NextResponse.json({ error: "Server error", details: error?.message || error }, { status: 500 });
  }
}
