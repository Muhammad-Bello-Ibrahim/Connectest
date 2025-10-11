"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  MessageCircle,
  Repeat2,
  Heart,
  Upload,
  MoreHorizontal,
  Bookmark
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
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
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const [activeFeed, setActiveFeed] = useState<'forYou' | 'following'>('forYou')

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
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                <AvatarImage src={post.author.avatar || ""} alt={post.author.name} />
                <AvatarFallback className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-muted flex items-center justify-center text-sm sm:px-5">{post.author.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold hover:underline cursor-pointer break-words" onClick={handleAuthorClick}>
                    {post.author.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="text-muted-foreground text-xs flex-shrink-0">
                    · {formatPostTime(post.createdAt)}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                        <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
              </div>

              <div className="mt-1 text-sm sm:text-[15px] leading-normal whitespace-pre-wrap break-words">
                {shouldTruncate ? `${post.content.slice(0, 150)}...` : post.content}
              </div>

              {post.club && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {post.club.name}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-around sm:justify-between max-w-sm sm:max-w-md mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-1.5 sm:px-2 sm:px-3 h-7 sm:h-8"
                  aria-label="Comment on post"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  <span className="text-xs">{post.commentCount || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-green-500 hover:bg-green-500/10 rounded-full px-1.5 sm:px-2 sm:px-3 h-7 sm:h-8"
                  aria-label="Repost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Repeat2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
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
                  className={`group flex items-center gap-1 sm:gap-1.5 rounded-full px-1.5 sm:px-2 sm:px-3 h-7 sm:h-8 ${
                    liked
                      ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-500/10'
                      : 'hover:text-pink-600 hover:bg-pink-500/10'
                  }`}
                  aria-label="Like post"
                >
                  <Heart className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${liked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{post.likeCount || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group flex items-center gap-1 sm:gap-1.5 hover:text-blue-500 hover:bg-blue-500/10 rounded-full px-1.5 sm:px-2 sm:px-3 h-7 sm:h-8"
                  aria-label="Share"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Upload className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
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
      <div className="min-h-screen bg-background">
        {/* Main Content - Twitter Feed */}
        <div className="w-full max-w-none md:max-w-[600px] md:mx-auto md:border-x border-border min-h-screen pb-16 md:pb-0">
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
                className={`flex-1 py-3 sm:py-4 text-sm sm:text-[15px] font-medium hover:bg-accent/50 transition-colors relative ${
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
                className={`flex-1 py-3 sm:py-4 text-sm sm:text-[15px] font-medium hover:bg-accent/50 transition-colors relative ${
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
    </>
  )
}
