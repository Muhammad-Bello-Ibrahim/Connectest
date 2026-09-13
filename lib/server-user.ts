import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function currentUser(request: NextRequest) {
  const token = request.cookies.get("connectrix-token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.id) return null;
  await connectDB();
  return User.findById(String(payload.id)).select("_id name email role clubs department faculty");
}
