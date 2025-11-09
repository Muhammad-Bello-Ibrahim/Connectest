import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Post } from "@/lib/models/Post";
import User from "@/lib/models/User";
import Club from "@/lib/models/Club";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

// Validation schema for post creation
const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title too long").optional(),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  club: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10, "Maximum 10 tags allowed").optional(),
  isPublic: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string()
  }).optional(),
  scheduledTime: z.string().datetime().optional()
});

export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 posts per page
    const club = searchParams.get('club');
    const author = searchParams.get('author');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    // Build filter
    const filter: any = { isPublic: true };
    
    if (club) filter.club = club;
    if (author) filter.author = author;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get posts with populated author and club data
    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .populate('club', 'name abbreviation')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        },
        options: { limit: 3, sort: { createdAt: -1 } } // Only show latest 3 comments
      })
      .sort({ isPinned: -1, createdAt: -1 }) // Pinned posts first, then by date
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Post.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error in GET /api/posts:', error);
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

    // Get user - convert payload.id to string if it's an object
    const userId = typeof payload.id === 'string' ? payload.id : String(payload.id);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse FormData
    const formData = await req.formData();
    
    // Extract fields from FormData
    const content = formData.get('content') as string;
    const locationStr = formData.get('location') as string | null;
    const scheduledTimeStr = formData.get('scheduledTime') as string | null;
    const images = formData.getAll('images') as File[];
    
    // Prepare post data
    const postData: any = {
      content: content || '',
      isPublic: true,
      images: []
    };
    
    // Handle location if provided
    if (locationStr) {
      try {
        const location = JSON.parse(locationStr);
        postData.location = location;
      } catch (e) {
        console.error('Error parsing location:', e);
      }
    }
    
    // Handle scheduled time if provided
    if (scheduledTimeStr) {
      postData.scheduledTime = new Date(scheduledTimeStr);
    }
    
    // Handle image uploads
    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        if (!(file instanceof File)) return null;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        
        // Generate unique filename
        const filename = `${uuidv4()}-${file.name}`;
        const path = join(uploadDir, filename);
        
        // Write file to disk
        await writeFile(path, buffer);
        
        return `/uploads/${filename}`;
      });
      
      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);
      postData.images = uploadedImages.filter(Boolean);
    }
    
    // Validate the post data
    const validationResult = createPostSchema.safeParse(postData);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validationResult.error.issues 
      }, { status: 400 });
    }

    const data = validationResult.data;

    // If posting to a club, verify user is a member
    if (data.club) {
      const club = await Club.findById(data.club);
      if (!club) {
        return NextResponse.json({ error: "Club not found" }, { status: 404 });
      }

      // Check if user is a member of the club
      const isMember = user.clubs?.some((userClub: any) => 
        userClub.toString() === data.club
      );

      if (!isMember && user.role !== 'admin') {
        return NextResponse.json({ 
          error: "You must be a member of this club to post" 
        }, { status: 403 });
      }
    }

    // Create post data object without undefined or null values
    const postDataToSave = {
      ...(data.title && { title: data.title }), // Only include title if it exists
      content: data.content,
      author: user._id,
      tags: data.tags?.map((tag: string) => tag.toLowerCase().trim()) || [],
      images: postData.images || [],
      ...(data.club && { club: data.club }), // Only include club if it exists
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }), // Only include isPublic if it exists
      ...(data.location && { location: data.location }), // Only include location if it exists
      ...(data.scheduledTime && { scheduledTime: data.scheduledTime }) // Only include scheduledTime if it exists
    };

    // Create post
    const newPost = await Post.create(postDataToSave);

    // Populate the post with author and club data
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'name avatar')
      .populate('club', 'name abbreviation');

    return NextResponse.json({ 
      message: "Post created successfully",
      post: populatedPost
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/posts:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      details: error
    });
    
    // Return more detailed error information in development
    const errorResponse = {
      error: 'Failed to create post',
      ...(process.env.NODE_ENV !== 'production' && {
        details: error.message,
        type: error.name,
        stack: error.stack
      })
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500 
    });
  }
}
