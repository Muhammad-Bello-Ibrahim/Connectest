import { NextRequest, NextResponse } from "next/server";
import Club from "@/lib/models/Club";
import { verifyToken } from "@/lib/auth"; // your JWT util

export async function GET(req: NextRequest) {
  // Optionally get user info from token
  const token = req.cookies.get('connectrix-token')?.value;
  let student = null;
  if (token) {
    const payload = await verifyToken(token);
    student = payload; // contains faculty, department, etc.
  }

  // Fetch all clubs, or filter by student details
  let clubs;
  if (student) {
    clubs = await Club.find({
      $or: [
        { faculty: student.faculty },
        { department: student.department },
        { state: student.state },
        { religion: student.religion },
        { type: "general" }
      ]
    });
  } else {
    clubs = await Club.find({});
  }

  return NextResponse.json(clubs);
}