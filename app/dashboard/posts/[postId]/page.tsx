"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MessageCircle,
  Repeat2,
  Upload,
  MoreHorizontal,
  Bookmark,
  ArrowLeft
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  tags: string[]
  likes: string[]
  comments: any[]
  shares: number
  isPinned: boolean
  createdAt: string
  likeCount: number
  commentCount: number
}

export default function PostDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const postId = params?.postId as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    if (postId && user) {
      fetchPost()
    }
  }, [postId, user])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/posts/${postId}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setPost(data.post)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Post not found"
        })
        router.back()
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load post"
      })
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post || liking) return

    setLiking(true)
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await res.json()

      if (res.ok) {
        setPost(prev => prev ? {
          ...prev,
          likes: data.liked
            ? [...prev.likes, user?._id || '']
            : prev.likes.filter(id => id !== user?._id),
          likeCount: data.likeCount
        } : null)
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
      setLiking(false)
    }
  }

  const formatPostTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) return 'yesterday'

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-muted rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <Button onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    )
  }

  const isLiked = post.likes.includes(user?._id || '')

  const handleAuthorClick = () => {
    router.push(`/dashboard/profile/${post.author._id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">Post</h1>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-2xl mx-auto">
        <article className="border-b border-border p-4 sm:p-6">
          {/* Author Info */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer flex-shrink-0" onClick={handleAuthorClick}>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold hover:underline cursor-pointer break-words" onClick={handleAuthorClick}>
                  {post.author.name.split(' ').slice(0, 2).join(' ')}
                </span>
                <span className="text-muted-foreground flex-shrink-0">
                  · {formatPostTime(post.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
          </div>

          {/* Post Content - Full */}
          <div className="mb-4">
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>

            {post.club && (
              <div className="mt-3">
                <Badge variant="secondary" className="gap-1">
                  {post.club.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between max-w-md">
            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-1.5 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              <span className="text-xs">{post.commentCount || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-1.5 hover:text-green-500 hover:bg-green-500/10"
            >
              <Repeat2 className="h-[18px] w-[18px]" />
              <span className="text-xs">{post.shares || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={liking}
              className={`group flex items-center gap-1.5 ${
                isLiked
                  ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-500/10'
                  : 'hover:text-pink-600 hover:bg-pink-500/10'
              }`}
            >
              <Heart className={`h-[18px] w-[18px] ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{post.likeCount || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-1.5 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <Upload className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </article>
      </div>

      <MobileNav />
    </div>
  )
}
