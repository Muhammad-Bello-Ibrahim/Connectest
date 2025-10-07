import { NextRequest, NextResponse } from "next/server";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import {connectDB} from "@/lib/db";
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

    // Check if club exists and is active
    const club = await Club.findById(clubId);
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    if (club.status !== "active") {
      return NextResponse.json({ 
        error: "Cannot join inactive club" 
      }, { status: 400 });
    }

    // Get user
    const user = await User.findById(payload.id).populate('clubs');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a member
    const isAlreadyMember = user.clubs.some((userClub: any) => 
      userClub._id.toString() === clubId
    );

    if (isAlreadyMember) {
      return NextResponse.json({ 
        error: "You are already a member of this club" 
      }, { status: 400 });
    }

    // Add club to user's clubs
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { clubs: clubId } }
    );

    // Increment club member count
    await Club.findByIdAndUpdate(
      clubId,
      { $inc: { members: 1 } }
    );

    return NextResponse.json({ 
      message: "Successfully joined the club!",
      club: {
        _id: club._id,
        name: club.name,
        members: club.members + 1
      }
    });

  } catch (error: any) {
    console.error('Error joining club:', error);
    return NextResponse.json({ 
      error: 'Failed to join club' 
    }, { status: 500 });
  }
}

export async function DELETE(
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

    // Get user
    const user = await User.findById(payload.id).populate('clubs');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a member
    const isMember = user.clubs.some((userClub: any) => 
      userClub._id.toString() === clubId
    );

    if (!isMember) {
      return NextResponse.json({ 
        error: "You are not a member of this club" 
      }, { status: 400 });
    }

    // Remove club from user's clubs
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { clubs: clubId } }
    );

    // Decrement club member count (ensure it doesn't go below 0)
    await Club.findByIdAndUpdate(
      clubId,
      { $inc: { members: -1 } }
    );
    
    // Ensure member count doesn't go negative
    await Club.findByIdAndUpdate(
      clubId,
      { $max: { members: 0 } }
    );

    return NextResponse.json({ 
      message: "Successfully left the club",
      club: {
        _id: club._id,
        name: club.name,
        members: Math.max(0, club.members - 1)
      }
    });

  } catch (error: any) {
    console.error('Error leaving club:', error);
    return NextResponse.json({ 
      error: 'Failed to leave club' 
    }, { status: 500 });
  }
}