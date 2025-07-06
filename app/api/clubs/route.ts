import { NextRequest, NextResponse } from "next/server";
import Club from "@/lib/models/Club";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const clubs = await Club.find({});
    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Error in GET /api/clubs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}