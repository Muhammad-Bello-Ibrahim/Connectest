import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { assignAndCreateClubsForUser } from "@/lib/utils";

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const body = await req.json();
    // Update fields
    Object.assign(user, body);
    await user.save();
    // Check profile completion
    const requiredFields = ["phone", "gender", "address", "state", "localGovt", "dob", "bio"];
    const isComplete = requiredFields.every(f => user[f]);
    if (isComplete) {
      // Assign clubs if profile is now complete
      const clubs = await assignAndCreateClubsForUser({
        facultyAbbr: user.faculty,
        facultyFull: user.facultyFull,
        departmentAbbr: user.department,
        departmentFull: user.departmentFull,
        state: user.state,
        religion: user.religion,
        lga: user.localGovt,
      });
      user.clubs = clubs;
      await user.save();
    }
    const userObj = user.toObject();
    delete userObj.password;
    return NextResponse.json({ user: userObj });
  } catch (err: any) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}
