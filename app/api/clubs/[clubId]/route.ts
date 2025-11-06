import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import Club from "@/lib/models/Club"
import User from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// Validation schema for club updates
const updateClubSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters").optional(),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  type: z.enum(["faculty", "department", "state", "religion", "general"]).optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  state: z.string().optional(),
  religion: z.string().optional(),
  logo: z.string().url().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

// GET /api/clubs/[clubId] - Get a specific club
export async function GET(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  await connectDB();
  
  try {
    const { clubId } = params;
    
    // Find the club and exclude sensitive data
    const club = await Club.findById(clubId)
      .select('-password -__v -createdAt -updatedAt')
      .populate('createdBy', 'name email')
      .lean();

    if (!club) {
      return NextResponse.json(
        { error: "Club not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ club });
    
  } catch (error) {
    console.error("Error fetching club:", error);
    return NextResponse.json(
      { error: "Failed to fetch club" },
      { status: 500 }
    );
  }
}

// PATCH /api/clubs/[clubId] - Partially update a club
export async function PATCH(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  await connectDB();
  
  try {
    const { clubId } = params;
    
    // Verify authentication
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(cookie);
    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Check if user is admin or club admin
    const user = await User.findById(payload.id);
    const isAdmin = user?.role === 'admin';
    const isClubAdmin = user?.clubs?.some((club: any) => 
      club.club.toString() === clubId && club.role === 'admin'
    );
    
    if (!isAdmin && !isClubAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = updateClubSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation Error',
          message: 'Please check your input data',
          details: validationResult.error.issues 
        }, 
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Check if club exists
    const existingClub = await Club.findById(clubId);
    if (!existingClub) {
      return NextResponse.json(
        { error: "Club not found" }, 
        { status: 404 }
      );
    }

    // Check for duplicate name if name is being updated
    if (updates.name && updates.name !== existingClub.name) {
      const nameExists = await Club.findOne({ 
        name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
        _id: { $ne: clubId }
      });
      
      if (nameExists) {
        return NextResponse.json(
          { error: "A club with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Check for duplicate email if email is being updated
    if (updates.email && updates.email !== existingClub.email) {
      const emailExists = await Club.findOne({ 
        email: updates.email.toLowerCase(),
        _id: { $ne: clubId }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: "This email is already in use by another club" },
          { status: 409 }
        );
      }
    }

    // Update the club
    const updatedClub = await Club.findByIdAndUpdate(
      clubId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -__v');

    return NextResponse.json({
      message: "Club updated successfully",
      club: updatedClub
    });
    
  } catch (error) {
    console.error("Error updating club:", error);
    return NextResponse.json(
      { error: "Failed to update club" },
      { status: 500 }
    );
  }
}

// PUT /api/clubs/[clubId] - Replace a club (full update)
export async function PUT(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  // For full updates, we can use the same handler as PATCH
  // since we're already validating all fields in the schema
  return PATCH(req, { params });
}

// DELETE /api/clubs/[clubId] - Delete a club
export async function DELETE(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
  await connectDB();

  try {
    const { clubId } = params;

    // Verify authentication
    const cookie = req.cookies.get("connectrix-token")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(cookie);
    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Check if user is admin
    const user = await User.findById(payload.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return NextResponse.json(
        { error: "Club not found" }, 
        { status: 404 }
      );
    }

    // Remove club from all users' clubs array
    await User.updateMany(
      { clubs: clubId },
      { $pull: { clubs: clubId } }
    );

    // Delete the club
    await Club.findByIdAndDelete(clubId);

    return NextResponse.json(
      { message: "Club deleted successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error deleting club:", error);
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 }
    );
  }
}