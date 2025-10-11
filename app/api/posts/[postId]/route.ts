import { NextRequest, NextResponse } from 'next/server'
import { Post } from '@/lib/models/Post'
import { connectDB } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connectDB()

  try {
    const post = await Post.findById(params.postId)
      .populate('author', 'name avatar')
      .populate('club', 'name abbreviation')
      .lean() as any

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Format the post data
    const formattedPost = {
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: {
        _id: post.author._id.toString(),
        name: post.author.name,
        avatar: post.author.avatar,
      },
      club: post.club ? {
        _id: post.club._id.toString(),
        name: post.club.name,
        abbreviation: post.club.abbreviation,
      } : null,
      tags: post.tags || [],
      likes: post.likes || [],
      comments: post.comments || [],
      shares: post.shares || 0,
      isPinned: post.isPinned || false,
      createdAt: post.createdAt.toISOString(),
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
