import { NextRequest, NextResponse } from "next/server";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  await connectDB();

  try {
    // Verify authentication
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const { clubId } = params;

    // Validate clubId
    if (!clubId) {
      return NextResponse.json({ error: "Club ID is required" }, { status: 400 });
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Check if club is payable
    if (!club.isPayable) {
      return NextResponse.json(
        { error: "This club does not require membership dues" },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(payload.id).populate("clubs");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a member of the club
    const isMember = user.clubs?.some(
      (userClub: { _id: { toString: () => string } }) =>
        userClub._id.toString() === clubId
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "You must be a member of this club to pay dues" },
        { status: 400 }
      );
    }

    // In a real implementation, this would integrate with a payment gateway
    // For now, we'll return a mock response indicating payment initiation
    return NextResponse.json({
      message: "Payment initiated successfully",
      club: {
        _id: club._id,
        name: club.name,
        membershipFeeAmount: club.membershipFeeAmount,
      },
      // In production, this would be a real payment gateway URL
      paymentUrl: null,
      paymentDetails: {
        amount: club.membershipFeeAmount,
        currency: "NGN",
        description: `Membership dues for ${club.name}`,
      },
    });
  } catch (error) {
    console.error("Error processing dues payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
