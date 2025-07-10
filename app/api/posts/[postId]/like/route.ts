import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/lib/models/Post";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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
    
    // Validate postId
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

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

    // Check if user already liked the post
    const hasLiked = post.likes.includes(user._id);

    if (hasLiked) {
      // Unlike the post
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: user._id } }
      );
      
      return NextResponse.json({ 
        message: "Post unliked",
        liked: false,
        likeCount: post.likes.length - 1
      });
    } else {
      // Like the post
      await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: user._id } }
      );
      
      return NextResponse.json({ 
        message: "Post liked",
        liked: true,
        likeCount: post.likes.length + 1
      });
    }

  } catch (error: any) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json({ 
      error: 'Failed to update like status' 
    }, { status: 500 });
  }
}