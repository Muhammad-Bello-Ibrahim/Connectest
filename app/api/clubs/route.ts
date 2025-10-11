import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import Club from "@/lib/models/Club";
import User from "@/lib/models/User";
import {connectDB} from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Validation schema for club creation
const createClubSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters").max(100, "Club name too long"),
  abbreviation: z.string().min(2, "Abbreviation must be at least 2 characters").max(10, "Abbreviation too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  type: z.enum(["faculty", "department", "state", "religion", "general"], {
    required_error: "Please select a club type"
  }),
  faculty: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  religion: z.string().max(50).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  createdBy: z.string().optional(),
  role: z.string().default("club"),
  status: z.string().default("active"),
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

    const clubs = await Club.find(filter).select('-password -__v').sort({ name: 1 });
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

    // Only admins can create clubs with credentials
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
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

    // Check if email is already in use
    const existingEmail = await Club.findOne({ email: data.email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json({ 
        error: "A club with this email already exists" 
      }, { status: 409 });
    }

    // Also check if email exists in User collection
    const existingUserEmail = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUserEmail) {
      return NextResponse.json({ 
        error: "This email is already registered" 
      }, { status: 409 });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create new club
    const newClub = await Club.create({
      ...data,
      password: hashedPassword,
      createdBy: user._id,
      members: 0, // Start with 0 members
    });

    // Return club data without password
    const clubData = await Club.findById(newClub._id).select('-password -__v');

    return NextResponse.json({ 
      message: "Club created successfully with login credentials",
      club: clubData
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/clubs:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ 
        error: `A club with this ${field} already exists` 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create club' 
    }, { status: 500 });
  }
}
