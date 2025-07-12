"use client"

import { useState, useEffect } from "react"
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

interface NewsfeedProps {
  showCreateButton?: boolean
  title?: string
  description?: string
}

export default function Newsfeed({ 
  showCreateButton = true, 
  title = "Newsfeed",
  description = "Stay updated with posts from your clubs and community"
}: NewsfeedProps) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())

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

  // Filter posts based on search
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const PostCard = ({ post }: { post: Post }) => {
    const isLiked = post.likes.includes(user?._id || '')
    const isLiking = likingPosts.has(post._id)

    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{post.author.name}</p>
                  {post.club && (
                    <Badge variant="outline" className="text-xs">
                      {post.club.abbreviation || post.club.name}
                    </Badge>
                  )}
                  {post.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                {post.author._id === user?._id && (
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikePost(post._id)}
                disabled={isLiking}
                className={`${isLiked ? 'text-red-500' : ''}`}
              >
                {isLiking ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                )}
                {post.likeCount}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPost(post)
                      fetchComments(post._id)
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.commentCount}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                    <DialogDescription>
                      Discuss this post with other members
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Add comment */}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isSubmittingComment}
                          size="sm"
                        >
                          {isSubmittingComment ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
                          Comment
                        </Button>
                      </div>
                    </div>
                    
                    {/* Comments list */}
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>
                              {comment.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg p-3">
                              <p className="font-medium text-sm">{comment.author.name}</p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </p>
                            <Button variant="ghost" size="sm" className="text-xs mt-1">
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {comments.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                {post.shares}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CreatePostDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share something with your community
          </DialogDescription>
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
            >
              {isCreatingPost ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {showCreateButton && <CreatePostDialog />}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={fetchPosts}
          disabled={loading}
        >
          Refresh
        </Button>
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
              {searchQuery 
                ? "No posts match your search criteria" 
                : "Be the first to share something with the community!"
              }
            </p>
            {!searchQuery && showCreateButton && <CreatePostDialog />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}