"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Heart,
  MessageCircle,
  Share2,
  User,
  CornerDownRight,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

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

interface NewsfeedProps {
  showCreateButton?: boolean
  title?: string
  description?: string
  clubId?: string
  clubName?: string
  clubAbbreviation?: string
}

export default function NewsfeedModern({
  title = "Newsfeed",
  description = "Stay updated with posts from your clubs and community",
  clubId,
  clubName,
  clubAbbreviation
}: NewsfeedProps) {
  const { user } = useAuth();
  const [activeFeed, setActiveFeed] = useState<"general" | "clubs">("general")
  const router = useRouter()

  // Mock posts for display
  const mockPosts: Post[] = [
    {
      _id: "1",
      title: "Welcome to Connectrix!",
      content: "This is your campus social feed. Post updates, join clubs, and connect with others! 🎉",
      author: { _id: "u1", name: "Admin", avatar: undefined },
      club: undefined,
      tags: ["welcome", "announcement"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: true,
      createdAt: new Date().toISOString(),
      likeCount: 24,
      commentCount: 5
    },
    {
      _id: "2",
      title: "Join GDG!",
      content: "We're looking for new members interested in technology and innovation. Weekly meetups, hackathons, workshops, and more exciting events await! 💻🚀",
      author: { _id: "u2", name: "GDG Lead", avatar: undefined },
      club: { _id: "c1", name: "Google Developer Group", abbreviation: "GDG" },
      tags: ["clubs", "coding", "technology"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likeCount: 42,
      commentCount: 12
    },
    {
      _id: "3",
      title: "NACOS Tutorial Day Announced",
      content: "Get ready for an amazing day of learning and networking! All computer science students are welcome. Topics include Web Development, Mobile Apps, and AI. 📚✨",
      author: { _id: "u3", name: "Academic Committee", avatar: undefined },
      club: { _id: "c2", name: "Nigerian Association of Computing Students", abbreviation: "NACOS" },
      tags: ["education", "event", "tutorial"],
      likes: [],
      comments: [],
      shares: 0,
      isPinned: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likeCount: 67,
      commentCount: 23
    }
  ]

  // Filter posts
  const filteredPosts = clubId
    ? mockPosts.filter(post => post.club && post.club._id === clubId)
    : (activeFeed === "general"
        ? mockPosts.filter(post => !post.club)
        : mockPosts.filter(post => post.club)
      )

  // Share handler
  const handleShare = (post: Post) => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Post link copied to clipboard." });
  };

  // Modern Post Card Component
  const PostCard = ({ post }: { post: Post }) => {
    const [comments, setComments] = useState(post.comments || []);
    const [commentContent, setCommentContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const handleComment = async () => {
      if (!commentContent.trim()) return;
      setSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        const newComment = {
          _id: Date.now().toString(),
          content: commentContent,
          author: { name: user?.name || "You", _id: user?._id || "current" },
          createdAt: new Date().toISOString(),
          replies: []
        };
        setComments(prev => [newComment, ...prev]);
        setCommentContent("");
        setSubmitting(false);
        setShowComments(true);
        toast({ title: "Comment posted!" });
      }, 500);
    };

    return (
      <Card className="mb-6 overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card animate-fade-in">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar with gradient */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-600 flex items-center justify-center text-lg font-bold text-white shadow-lg hover:scale-110 transition-transform">
                  {post.club ? (post.club.abbreviation?.[0] || post.club.name[0]) : post.author.name[0]}
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-base hover:text-primary transition-colors cursor-pointer">
                    {post.club ? post.club.name : post.author.name}
                  </span>
                  {post.club && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                      {post.club.abbreviation}
                    </span>
                  )}
                  {post.isPinned && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
                
                {/* Content */}
                <div className="mt-4 text-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                  {post.content}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 flex-1 hover:bg-red-50 dark:hover:bg-red-950/20 ${liked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 transition-all ${liked ? 'fill-red-500 scale-110' : ''}`} />
                <span className="font-semibold">{likeCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 flex-1 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">{comments.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 flex-1 hover:bg-green-50 dark:hover:bg-green-950/20"
                onClick={() => handleShare(post)}
              >
                <Share2 className="h-5 w-5" />
                <span className="font-semibold">Share</span>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="px-6 pb-6 space-y-4 bg-muted/30 border-t">
              {/* Comment input */}
              <div className="flex gap-3 pt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-background"
                    disabled={submitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && commentContent.trim()) {
                        e.preventDefault();
                        handleComment();
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleComment} 
                    disabled={submitting || !commentContent.trim()}
                    className="px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Comments List */}
              {comments && comments.length > 0 && (
                <div className="space-y-3 pt-2">
                  {comments.map((comment: any, idx: number) => (
                    <div key={comment._id || idx} className="flex gap-3 animate-slide-up">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {comment.author?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1 bg-background rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.author?.name || "User"}</span>
                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : "now"}
                          </span>
                        </div>
                        <div className="text-sm text-foreground">{comment.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top nav bar */}
      {!clubId && (
        <div className="flex items-center justify-between mb-8 sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 border-b">
          {/* User icon left */}
          <button
            className="flex items-center gap-2 hover:bg-muted p-2 rounded-lg transition-colors"
            aria-label="Profile"
            onClick={() => router.push("/dashboard/profile")}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || <User className="h-5 w-5" />}
            </div>
          </button>
          
          {/* Toggler centered */}
          <div className="flex-1 flex justify-center">
            <div className="inline-flex bg-muted rounded-full p-1 shadow-sm">
              <button
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFeed === "general"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveFeed("general")}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  General
                </div>
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFeed === "clubs"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveFeed("clubs")}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Clubs
                </div>
              </button>
            </div>
          </div>
          
          {/* Spacer for symmetry */}
          <div className="w-14" />
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
        <Card className="text-center py-16 border-dashed">
          <CardContent>
            <MessageCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share something with the community!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
