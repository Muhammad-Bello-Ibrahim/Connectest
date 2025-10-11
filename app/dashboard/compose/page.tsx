"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Image as ImageIcon, Smile, Calendar, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"

export default function ComposePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [charCount, setCharCount] = useState(0)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  // Update character count
  useEffect(() => {
    setCharCount(content.length)
  }, [content])

  const handleCreatePost = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write something"
      })
      return
    }

    if (content.length > 500) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Post content cannot exceed 500 characters"
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
          content: content.trim(),
          isPublic: true
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Posted!",
          description: "Your post has been shared"
        })
        router.back() // Go back to previous page
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

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <h1 className="text-base sm:text-lg font-semibold">Create Post</h1>

          <Button
            onClick={handleCreatePost}
            disabled={!content.trim() || isCreatingPost || content.length > 500}
            className="rounded-full px-4 sm:px-6 h-8 sm:h-9 text-sm"
          >
            {isCreatingPost ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      {/* Compose Area */}
      <div className="max-w-2xl mx-auto p-3 sm:p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
            <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="What is happening?!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] text-[15px] border-none resize-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
              autoFocus
              maxLength={500}
            />

            {/* Character count */}
            <div className="flex justify-between items-center mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
              <span>{charCount}/500</span>
              {charCount > 450 && (
                <span className={`text-xs sm:text-sm ${charCount > 500 ? "text-destructive" : "text-yellow-500"}`}>
                  {charCount > 500 ? "Too long" : "Almost full"}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10">
                <ImageIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10">
                <Smile className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10">
                <Calendar className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-primary hover:bg-primary/10">
                <MapPin className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
