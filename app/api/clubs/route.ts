import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Validation schema for club creation
const createClubSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters").max(100, "Club name too long"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").max(10, "Abbreviation too long").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  type: z.enum(["faculty", "department", "state", "religion", "general"], {
    required_error: "Please select a club type"
  }),
  faculty: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  religion: z.string().max(50).optional(),
});

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const faculty = searchParams.get('faculty');
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'active';
    
    // Build filter object
    const filter: any = { status };
    if (type) filter.type = type;
    if (faculty) filter.faculty = faculty.toUpperCase();
    if (department) filter.department = department.toUpperCase();

    const clubs = await Club.find(filter).select('-__v').sort({ name: 1 });
    return NextResponse.json({ clubs, total: clubs.length });
  } catch (error) {
    console.error('Error in GET /api/clubs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    // Get user to check permissions
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createClubSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validationResult.error.issues 
      }, { status: 400 });
    }

    const data = validationResult.data;

    // Check if club with same name already exists
    const existingClub = await Club.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') } 
    });
    
    if (existingClub) {
      return NextResponse.json({ 
        error: "A club with this name already exists" 
      }, { status: 409 });
    }

    // Create new club
    const newClub = await Club.create({
      ...data,
      status: "pending", // New clubs need approval
      members: 1, // Creator is the first member
    });

    // Add club to user's clubs
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { clubs: newClub._id } }
    );

    return NextResponse.json({ 
      message: "Club created successfully and submitted for approval",
      club: {
        _id: newClub._id,
        name: newClub.name,
        description: newClub.description,
        type: newClub.type,
        status: newClub.status,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/clubs:', error);
    return NextResponse.json({ 
      error: 'Failed to create club' 
    }, { status: 500 });
  }
}