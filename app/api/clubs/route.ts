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
  isPayable: z.boolean().default(false),
  membershipFeeAmount: z.number().min(0, "Membership fee must be a positive number").nullable().optional(),
}).refine((data) => {
  // If isPayable is true, membershipFeeAmount must be provided and greater than 0
  if (data.isPayable) {
    return data.membershipFeeAmount !== null && data.membershipFeeAmount !== undefined && data.membershipFeeAmount > 0;
  }
  return true;
}, {
  message: "Membership fee amount is required when club is payable",
  path: ["membershipFeeAmount"],
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
      return NextResponse.json({ error: "Unauthorized: No authentication token provided" }, { status: 401 });
    }

    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid or expired authentication token" }, { status: 403 });
    }

    // Get user to check permissions
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // Only admins can create clubs with credentials
    if (user.role !== 'admin') {
      return NextResponse.json({ 
        error: "Insufficient permissions. Only administrators can create clubs." 
      }, { status: 403 });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      console.log('Received request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON payload' 
      }, { status: 400 });
    }

    const validationResult = createClubSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error);
      return NextResponse.json({ 
        error: 'Validation Error',
        message: 'Please check your input data',
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, { status: 400 });
    }

    const data = validationResult.data;

    // Check if club with same name already exists (case insensitive)
    const existingClub = await Club.findOne({ 
      name: { $regex: new RegExp(`^${data.name}$`, 'i') } 
    });
    
    if (existingClub) {
      return NextResponse.json({ 
        error: "Club name already in use",
        message: `A club with the name "${data.name}" already exists. Please choose a different name.`,
        field: "name"
      }, { status: 409 });
    }

    // Check if email is already in use by another club
    const existingEmail = await Club.findOne({ 
      email: data.email.toLowerCase() 
    });
    
    if (existingEmail) {
      return NextResponse.json({ 
        error: "Email already in use",
        message: `The email ${data.email} is already registered to another club. Please use a different email address.`,
        field: "email"
      }, { status: 409 });
    }

    // Check if email exists in User collection
    const existingUserEmail = await User.findOne({ 
      email: data.email.toLowerCase() 
    });
    
    if (existingUserEmail) {
      return NextResponse.json({ 
        error: "Email registered to user",
        message: `The email ${data.email} is already registered as a user. Please use a different email address.`,
        field: "email"
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
      isPayable: data.isPayable || false,
      membershipFeeAmount: data.isPayable ? data.membershipFeeAmount : null,
    });

    // Create a User account for the club with role=club
    try {
      const clubUser = await User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword, // Same password as club
        role: 'club',
        bio: data.description || `Official account for ${data.name}`,
        isActive: true,
      });

      console.log(`Club user created with ID: ${clubUser._id} for club: ${data.name}`);
    } catch (userError: any) {
      // If user creation fails (e.g., duplicate email), log but don't fail club creation
      console.error('Failed to create club user account:', userError);
      
      // Only fail if it's not a duplicate key error
      if (userError.code !== 11000) {
        // Rollback club creation
        await Club.findByIdAndDelete(newClub._id);
        throw new Error('Failed to create club user account: ' + userError.message);
      }
    }

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
      const value = error.keyValue[field];
      const fieldName = field === 'email' ? 'email address' : field;
      
      return NextResponse.json({ 
        error: 'Duplicate entry',
        message: `A club with this ${fieldName} (${value}) already exists. Please use a different ${fieldName}.`,
        field: field,
        value: value
      }, { status: 409 });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        type: err.kind
      }));
      
      return NextResponse.json({
        error: 'Validation failed',
        message: 'Please correct the following errors and try again:',
        details: errors
      }, { status: 400 });
    }
    
    // Handle other errors
    return NextResponse.json({ 
      error: 'Server Error',
      message: 'An unexpected error occurred while creating the club. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { 
      status: 500 
    });
  }
}
