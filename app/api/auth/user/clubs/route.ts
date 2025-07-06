import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
    const user = await User.findById(payload.id).populate("clubs");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Log student details and club names for verification
    console.log("User clubs verification:", {
      name: user.name,
      email: user.email,
      clubs: Array.isArray(user.clubs) ? user.clubs.map((club: any) => club?.name) : [],
    });
    const validClubs = Array.isArray(user.clubs) ? user.clubs.filter(Boolean) : [];
    return NextResponse.json({ clubs: validClubs });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error?.message || error }, { status: 500 });
  }
}
