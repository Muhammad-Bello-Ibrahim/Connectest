import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Post, Comment } from "@/lib/models/Post";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Validation schema for comment creation
const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  parentComment: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connectDB();
  
  try {
    const { postId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    
    // Get comments for the post
    const skip = (page - 1) * limit;
    
    const comments = await Comment.find({ 
      post: postId,
      parentComment: { $exists: false } // Only top-level comments
    })
      .populate('author', 'name avatar')
      .populate({
        path: 'parentComment',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name avatar')
          .sort({ createdAt: 1 })
          .limit(5); // Limit replies to 5

        return {
          ...comment.toObject(),
          replies,
          replyCount: await Comment.countDocuments({ parentComment: comment._id })
        };
      })
    );

    const total = await Comment.countDocuments({ 
      post: postId,
      parentComment: { $exists: false }
    });

    return NextResponse.json({
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
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

    const { postId } = params;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get user
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = createCommentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validationResult.error.issues 
      }, { status: 400 });
    }

    const data = validationResult.data;

    // If this is a reply, check if parent comment exists
    if (data.parentComment) {
      const parentComment = await Comment.findById(data.parentComment);
      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
      if (parentComment.post.toString() !== postId) {
        return NextResponse.json({ error: "Parent comment doesn't belong to this post" }, { status: 400 });
      }
    }

    // Create comment
    const newComment = await Comment.create({
      content: data.content,
      author: user._id,
      post: postId,
      parentComment: data.parentComment || undefined,
    });

    // Add comment to post's comments array
    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } }
    );

    // Populate the comment with author data
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'name avatar');

    return NextResponse.json({ 
      message: "Comment created successfully",
      comment: populatedComment
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment' 
    }, { status: 500 });
  }
}