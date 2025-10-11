import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" })
  clearAuthCookies(response)
  return response
}
