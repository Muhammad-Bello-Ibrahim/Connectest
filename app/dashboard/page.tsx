"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Repeat2,
  Bookmark,
  Upload,
  Image as ImageIcon,
  Smile,
  Calendar,
  MapPin,
  Home,
  Bell,
  User,
  Users,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileNav } from "@/components/mobile-nav"

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

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const [activeFeed, setActiveFeed] = useState<'forYou' | 'following'>('forYou')
  const [showComposeDialog, setShowComposeDialog] = useState(false)

  // Secure redirect for unauthorized or wrong-role users
  useEffect(() => {
    if (!user || user.role !== "student") {
      router.replace("/login")
    }
  }, [user, router])

  // Fetch posts
  useEffect(() => {
    if (user && user.role === "student") {
      fetchPosts()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/posts', {
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
    if (!newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write something"
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
          title: "Post",
          content: newPostContent.trim(),
          isPublic: true
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Posted!",
          description: "Your post has been shared"
        })
        setNewPostContent("")
        setPosts(prev => [data.post, ...prev])
        setShowComposeDialog(false)
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

  const isLiked = (post: Post) => {
    return post.likes.includes(user?._id || '')
  }

  // Custom timestamp formatter
  const formatPostTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Less than 60 seconds - show seconds
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`
    }

    // Less than 60 minutes - show minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    }

    // Less than 24 hours - show hours
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h`
    }

    // Yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return 'yesterday'
    }

    // More than 1 day ago - show day and month
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  // Twitter-like Post Card
  const PostCard = ({ post }: { post: Post }) => {
    const liked = isLiked(post)
    const shouldTruncate = post.content.length > 150

    const handleAuthorClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      router.push(`/dashboard/profile/${post.author._id}`)
    }

    return (
      <div className="border-b border-border">
        <Link href={`/dashboard/posts/${post._id}`} className="block">
          <article className="flex px-3 sm:px-4 py-3 hover:bg-accent/50 transition-colors">
            <div className="flex-shrink-0 mr-2 sm:mr-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold hover:underline cursor-pointer" onClick={handleAuthorClick}>
                    {post.author.name.split(' ')[0]}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    · {formatPostTime(post.createdAt)}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Report post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-1 text-[15px] leading-normal whitespace-pre-wrap break-words">
                {shouldTruncate ? `${post.content.slice(0, 150)}...` : post.content}
              </div>

              {post.club && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {post.club.name}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-around sm:justify-between max-w-md mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-2 sm:px-3 h-8"
                  aria-label="Comment on post"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                  <span className="text-xs">{post.commentCount || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-green-500 hover:bg-green-500/10 rounded-full px-2 sm:px-3 h-8"
                  aria-label="Repost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Repeat2 className="h-[18px] w-[18px]" />
                  <span className="text-xs">{post.shares || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleLikePost(post._id)
                  }}
                  disabled={likingPosts.has(post._id)}
                  className={`group flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 h-8 ${
                    liked
                      ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-500/10'
                      : 'hover:text-pink-600 hover:bg-pink-500/10'
                  }`}
                  aria-label="Like post"
                >
                  <Heart className={`h-[18px] w-[18px] ${liked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{post.likeCount || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-2 sm:px-3 h-8"
                  aria-label="Share"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Upload className="h-[18px] w-[18px]" />
                </Button>
              </div>
            </div>
          </article>
        </Link>
      </div>
    )
  }

  return (
    <>
        {/* Main Twitter-like Layout */}
      <div className="min-h-screen bg-background w-[90vw] md:ml-[-10vw]">
        {/* Main Content - Twitter Feed */}
        <div className="w-full md:max-w-[600px] md:mx-auto md:border-x border-border min-h-screen pb-20 md:pb-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center justify-between px-3 sm:px-4 h-[53px]">
              <h1 className="text-xl font-bold">Connectrix</h1>
              <Button variant="ghost" size="icon" className="rounded-full">
                {/* <Sparkles className="h-5 w-5" /> */}
              </Button>
            </div>
            
            {/* Feed Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveFeed('forYou')}
                className={`flex-1 py-4 text-[15px] font-medium hover:bg-accent/50 transition-colors relative ${
                  activeFeed === 'forYou' ? 'font-bold' : 'text-muted-foreground'
                }`}
              >
                For you
                {activeFeed === 'forYou' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveFeed('following')}
                className={`flex-1 py-4 text-[15px] font-medium hover:bg-accent/50 transition-colors relative ${
                  activeFeed === 'following' ? 'font-bold' : 'text-muted-foreground'
                }`}
              >
                Following
                {activeFeed === 'following' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Compose Tweet Box - Desktop Only */}
          <div className="hidden md:block border-b border-border px-4 py-3 w-full overflow-hidden">
            <div className="flex gap-1.5 sm:gap-3 w-full">
              <Avatar className="h-7 w-7 sm:h-10 sm:w-10 flex-shrink-0">
                <AvatarImage src={user?.name} />
                <AvatarFallback className="text-xs sm:text-sm">{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 w-full overflow-hidden">
                <Textarea
                  placeholder="What is happening?!"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[40px] sm:min-h-[60px] text-xs sm:text-[15px] border-none resize-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground w-full"
                />
                <div className="flex items-center justify-between mt-1.5 sm:mt-3 pt-1.5 sm:pt-3 border-t border-border w-full">
                  <div className="flex items-center gap-0 sm:gap-1 -ml-1 sm:ml-0 flex-shrink">
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10 flex-shrink-0">
                      <ImageIcon className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10 flex-shrink-0 hidden sm:inline-flex">
                      <Calendar className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10 flex-shrink-0 hidden sm:inline-flex">
                      <MapPin className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || isCreatingPost}
                    className="rounded-full px-2.5 sm:px-4 h-6 sm:h-9 font-bold text-[10px] sm:text-sm flex-shrink-0 ml-1.5 sm:ml-2"
                  >
                    {isCreatingPost ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex px-4 py-3 border-b border-border animate-pulse">
                  <div className="h-10 w-10 bg-muted rounded-full mr-3" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground text-sm">
                Be the first to share something!
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Mobile Bottom Navigation */}
      <MobileNav />

      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComposeDialog(false)}
                className="rounded-full"
              >
                ✕
              </Button>
              <DialogTitle className="sr-only">Create Post</DialogTitle>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isCreatingPost}
                className="rounded-full px-4 h-8 font-bold"
              >
                {isCreatingPost ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </DialogHeader>
          <div className="px-4 pb-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage src={user?.name} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="What is happening?!"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[120px] text-[15px] border-none resize-none focus-visible:ring-0 p-0"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 mt-4 ml-[52px]">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary">
                <ImageIcon className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary">
                <Smile className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary">
                <Calendar className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary">
                <MapPin className="h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
