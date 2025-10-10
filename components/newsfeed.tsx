"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Heart,
  MessageCircle,
  Share2,
  User,
  CornerDownRight,
  Copy as CopyIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Post {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  club?: {
    _id: string
    name: string
    abbreviation?: string
  }
  tags: string[]
  likes: string[]
  comments: any[]
  shares: number
  isPinned: boolean
  createdAt: string
  likeCount: number
  commentCount: number
}

import { useAuth } from "@/hooks/use-auth"

interface NewsfeedProps {
  showCreateButton?: boolean
  title?: string
  description?: string
  clubId?: string
  clubName?: string
  clubAbbreviation?: string
}

export default function Newsfeed({
  title = "Newsfeed",
  description = "Stay updated with posts from your clubs and community",
  clubId,
  clubName,
  clubAbbreviation
}: NewsfeedProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)
  // Only show toggler if not in club context
  const [activeFeed, setActiveFeed] = useState<"general" | "clubs">("general")
  const router = useRouter()

  // Mock posts for display
  const mockPosts: Post[] = [
    {
      _id: "1",
      title: "Welcome to Connectrix!",
      content: "This is your campus social feed. Post updates, join clubs, and connect with others!",
      author: { _id: "u1", name: "Admin", avatar: undefined },
      club: undefined,
      tags: ["welcome", "announcement"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: true,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
    },
    {
      _id: "2",
      title: "Join GDG!",
      content: "We're looking for new members. Weekly meetups, hackathons, and more.",
      author: { _id: "u2", name: "GDG", avatar: undefined },
      club: { _id: "c1", name: "GDG", abbreviation: "CODE" },
      tags: ["clubs", "coding"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likeCount: 0,
      commentCount: 0
    },
    {
      _id: "3",
      title: "NACOS Tutorial Day Announced",
      content: "Get ready for a day of fun and games! All students are welcome.",
      author: { _id: "u3", name: "Academic Committee", avatar: undefined },
      club: { _id: "c2", name: "NACOS", abbreviation: "NACOS" },
      tags: ["sports", "event"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likeCount: 0,
      commentCount: 0
    }
  ]

  // Filter posts: if clubId is present, only show posts for that club
  const filteredPosts = clubId
    ? mockPosts.filter(post => post.club && post.club._id === clubId)
    : (activeFeed === "general"
        ? mockPosts.filter(post => !post.club)
        : mockPosts.filter(post => post.club)
      )

  // Threaded comments UI with real posting
  const CommentThread = ({ comments, postId, parentId = null, depth = 0, onComment }: { comments: any[], postId: string, parentId?: string | null, depth?: number, onComment: (content: string, parentId?: string) => void }) => {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const handleReply = async (parentCommentId: string) => {
      if (!replyContent.trim()) return;
      await onComment(replyContent, parentCommentId);
      setReplyContent("");
      setReplyingTo(null);
    };

    return (
      <div className={depth > 0 ? `ml-${Math.min(depth * 4, 12)}` : ""}>
        {comments.map((comment, idx) => (
          <div key={comment._id || idx} className="mt-2 flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
              {comment.author?.name?.[0] || "U"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment.author?.name || "User"}</span>
                <span className="text-xs text-zinc-400">{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "now"}</span>
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-100">{comment.content}</div>
              <button className="flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline" onClick={() => setReplyingTo(comment._id)}>
                <CornerDownRight className="h-3 w-3" /> Reply
              </button>
              {replyingTo === comment._id && (
                <div className="mt-2 flex gap-2">
                  <Input
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="text-xs"
                  />
                  <Button size="sm" onClick={() => handleReply(comment._id)}>
                    Send
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                </div>
              )}
              {/* Nested replies */}
              {comment.replies && comment.replies.length > 0 && (
                <CommentThread comments={comment.replies} postId={postId} parentId={comment._id} depth={depth + 1} onComment={onComment} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Share handler
  const handleShare = (post: Post) => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Post link copied to clipboard." });
  };

  // Enhanced post card with modern design
  const PostCard = ({ post }: { post: Post }) => {
    const [comments, setComments] = useState(post.comments || []);
    const [commentContent, setCommentContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);

    // Real comment posting
    const handleComment = async (content: string, parentId?: string) => {
      if (!content.trim()) return;
      setSubmitting(true);
      try {
        const res = await fetch(`/api/posts/${post._id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, parentComment: parentId })
        });
        const data = await res.json();
        if (res.ok) {
          toast({ title: "Comment posted" });
          // Optimistically add comment (flat, for demo; in real app, refetch or update tree)
          setComments(prev => [data.comment, ...prev]);
        } else {
          toast({ variant: "destructive", title: "Error", description: data.error || "Failed to post comment" });
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Network error" });
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4 shadow-sm flex flex-col">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center text-lg font-bold text-zinc-700">
              {post.club ? (post.club.abbreviation?.[0] || post.club.name[0]) : post.author.name[0]}
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {post.club ? post.club.name : post.author.name}
              </span>
              <span className="text-xs text-zinc-400">
                · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
              {post.club && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {post.club.abbreviation}
                </span>
              )}
            </div>
            {/* Content */}
            <div className="mt-1 text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap">
              {post.content}
            </div>
            {/* Actions */}
            <div className="flex items-center gap-6 mt-3 text-zinc-500">
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.likeCount}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{comments.length}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors" onClick={() => handleShare(post)}>
                <Share2 className="h-4 w-4" />
                <span className="text-xs">Share</span>
              </button>
            </div>
            {/* Comment input */}
            <div className="mt-4 flex gap-2">
              <Input
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="text-sm"
                disabled={submitting}
              />
              <Button size="sm" onClick={() => { handleComment(commentContent); setCommentContent(""); }} disabled={submitting || !commentContent.trim()}>
                {submitting ? "Posting..." : "Comment"}
              </Button>
            </div>
            {/* Threaded comments */}
            {comments && comments.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <CommentThread comments={comments} postId={post._id} onComment={handleComment} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Top nav bar: user icon left, toggler centered (only if not in club context)
  return (
    <div className="space-y-6">
      {/* Top nav bar */}
      {!clubId && (
        <div className="flex items-center justify-between mb-6">
          {/* User icon left */}
          <button
            className="flex items-center"
            aria-label="Profile"
            onClick={() => router.push("/dashboard/profile")}
          >
            <User className="h-7 w-7 text-zinc-700 dark:text-zinc-200" />
          </button>
          {/* Toggler centered */}
          <div className="flex-1 flex justify-center">
            <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1">
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeFeed === "general"
                    ? "bg-blue-500 text-white"
                    : "text-zinc-700 dark:text-zinc-200"
                }`}
                onClick={() => setActiveFeed("general")}
              >
                General
              </button>
              <button
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeFeed === "clubs"
                    ? "bg-blue-500 text-white"
                    : "text-zinc-700 dark:text-zinc-200"
                }`}
                onClick={() => setActiveFeed("clubs")}
              >
                Clubs
              </button>
            </div>
          </div>
          {/* Spacer for symmetry */}
          <div className="w-7" />
        </div>
      )}
      {/* Posts */}
      {filteredPosts.length > 0 ? (
        <div>
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              No posts to display.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}