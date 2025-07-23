"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Pin,
  User,
  Users,
  Hash,
  Plus,
  Search,
  Filter,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  createdAt: string
  likes: string[]
  replies?: Comment[]
  replyCount?: number
}

export default function NewsfeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const [activeFeed, setActiveFeed] = useState<'general' | 'clubs'>("general")
  const [searchQuery, setSearchQuery] = useState("")
  // Profile completion state (dismissible)
  const requiredFields = [
    'phone', 'gender', 'address', 'state', 'localGovt', 'dob', 'bio'
  ];
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(true);


  // Calculate profile completion
  useEffect(() => {
    if (!user) {
      setProfileCompletion(0);
      setIsProfileComplete(true);
      return;
    }
    let filled = 0;
    requiredFields.forEach(f => { if (user[f]) filled++; });
    const percent = Math.round((filled / requiredFields.length) * 100);
    setProfileCompletion(percent);
    setIsProfileComplete(percent === 100);
  }, [user]);

  // Fetch posts
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      
      const res = await fetch(`/api/posts?${params}`, {
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load posts"
        })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error while loading posts"
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both title and content"
      })
      return
    }

    try {
      setIsCreatingPost(true)
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newPostTitle.trim(),
          content: newPostContent.trim(),
          isPublic: true
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Your post has been created"
        })
        setNewPostTitle("")
        setNewPostContent("")
        setPosts(prev => [data.post, ...prev])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to create post"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error while creating post"
      })
    } finally {
      setIsCreatingPost(false)
    }
  }

  // Like/unlike post
  const handleLikePost = async (postId: string) => {
    if (likingPosts.has(postId)) return

    setLikingPosts(prev => new Set([...prev, postId]))

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await res.json()
      
      if (res.ok) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: data.liked 
                  ? [...post.likes, user?._id || ''] 
                  : post.likes.filter(id => id !== user?._id),
                likeCount: data.likeCount
              }
            : post
        ))
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update like"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error"
      })
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return

    try {
      setIsSubmittingComment(true)
      const res = await fetch(`/api/posts/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment.trim()
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setComments(prev => [data.comment, ...prev])
        setNewComment("")
        
        // Update post comment count
        setPosts(prev => prev.map(post => 
          post._id === selectedPost._id
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        ))
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to add comment"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error"
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Filter posts based on toggler
  const filteredPosts = activeFeed === "general"
    ? posts.filter(post => !post.club)
    : posts.filter(post => post.club)

  const PostCard = ({ post }: { post: Post }) => (
    <div className="flex px-4 py-3 hover:bg-muted/50 transition-colors border-b border-zinc-200 dark:border-zinc-800">
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3">
        <div className="w-11 h-11 rounded-full bg-zinc-300 flex items-center justify-center text-lg font-bold text-zinc-700 overflow-hidden">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            post.author.name[0]
          )}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Username, handle, timestamp */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{post.author.name}</span>
          {/* Optional: <span className="text-muted-foreground">@{post.author.handle}</span> */}
          <span className="text-muted-foreground">· {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          {post.club && (
            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">{post.club.abbreviation}</span>
          )}
        </div>
        {/* Post content */}
        <div className="mt-1 text-base text-foreground whitespace-pre-wrap break-words">
          {post.content}
        </div>
        {/* Action bar */}
        <div className="flex items-center justify-between max-w-xs mt-3 text-muted-foreground">
          <button className="group flex items-center gap-1 hover:text-primary transition-colors">
            <MessageCircle className="h-5 w-5 group-hover:stroke-primary" />
            <span className="text-xs">{post.commentCount}</span>
          </button>
          <button className="group flex items-center gap-1 hover:text-green-600 transition-colors">
            <Share2 className="h-5 w-5 group-hover:stroke-green-600" />
          </button>
          <button className="group flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5 group-hover:fill-red-500" />
            <span className="text-xs">{post.likeCount}</span>
          </button>
          <button className="group flex items-center gap-1 hover:text-primary transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-0 max-w-xl mx-auto pb-24">
      {/* Profile completion banner (always visible if incomplete) */}
      {!isProfileComplete && (
        <div className="sticky top-0 z-20 bg-yellow-50 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3 flex flex-col gap-2 items-center text-yellow-900 dark:text-yellow-100 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Complete your profile</span>
            <span className="text-xs">({profileCompletion}% done)</span>
          </div>
          <div className="w-full max-w-xs h-2 bg-yellow-100 dark:bg-yellow-800 rounded-full overflow-hidden">
            <div
              className="h-2 bg-yellow-500 transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <span className="text-xs">Fill in: {requiredFields.filter(f => !user?.[f]).join(", ")}</span>
          <Link href="/dashboard/profile" className="text-xs underline text-yellow-800 dark:text-yellow-200">Go to profile</Link>
        </div>
      )}
      {/* Post box always at top */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 flex gap-3 items-start sticky top-[48px] z-10">
        <div className="flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-zinc-700 dark:text-zinc-200" />
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Post title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={2}
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCreatePost}
              disabled={!newPostTitle.trim() || !newPostContent.trim() || isCreatingPost}
              loading={isCreatingPost}
              loadingText="Posting..."
              className="rounded-full px-6"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
      {/* Toggle centered below */}
      <div className="flex justify-center mt-2 mb-2">
        <div className="inline-flex bg-muted dark:bg-zinc-800 rounded-full p-1">
          <button
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${activeFeed === "general" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
            onClick={() => setActiveFeed("general")}
          >
            General
          </button>
          <button
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${activeFeed === "clubs" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
            onClick={() => setActiveFeed("clubs")}
          >
            Clubs
          </button>
        </div>
      </div>
      {/* Posts */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
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
              Be the first to share something with the community!
            </p>
          </CardContent>
        </Card>
      )}
      {/* Floating Action Button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full h-14 w-14 p-0 shadow-lg bg-green-600 hover:bg-green-700 text-white text-3xl flex items-center justify-center">
              <Plus className="h-7 w-7" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Share something with your community</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Post title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim() || isCreatingPost}
                  loading={isCreatingPost}
                  loadingText="Posting..."
                >
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}