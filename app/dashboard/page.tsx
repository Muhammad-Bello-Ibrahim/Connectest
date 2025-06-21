"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Heart, MessageCircle, Share2, MoreHorizontal, Image, Video, Paperclip } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

// Mock newsfeed data with media
const mockNewsfeed = [
  {
    id: 1,
    author: "Mr. Muhammad Dawaki",
    authorRole: "Club Advisor",
    authorAvatar: "/avatar.jpeg",
    content:
      "Excited to announce our upcoming NACOS hackathon! Join us for 48 hours of coding, collaboration, and innovation. Prizes for the top three teams!",
    media: {
      type: "image",
      url: "/feed_1.jpeg",
      alt: "Hackathon promotional image",
    },
    time: "2 hours ago",
    likes: 42,
    comments: 8,
    shares: 15,
    faculty: "Science",
    department: "Computer Science",
    club: "Computer Science Club",
    type: "club",
    isFollowing: true,
  },
  {
    id: 2,
    author: "Prof. H. Hamza",
    authorRole: "Faculty Dean",
    authorAvatar: "/avatar.jpeg",
    content:
      "Important announcement for all Science Faculty students: The annual Science Day will be held next month. Registration is now open. Please visit the faculty office for more details.",
    media: {
      type: "video",
      url: "https://youtu.be/_e49U-pIwzQ?si=wSb4N-x-gcVN4VXF",
      thumbnail: "/feed_2.jpeg",
      alt: "Science Fair promotional video",
    },
    time: "1 day ago",
    likes: 87,
    comments: 23,
    shares: 34,
    faculty: "Science",
    department: null,
    club: null,
    type: "faculty",
    isFollowing: true,
  },
  {
    id: 3,
    author: "Photography Club",
    authorRole: "Student Club",
    authorAvatar: "/avatar.jpeg",
    content:
      "Check out these amazing photos from our recent campus photography walk! Thanks to everyone who participated.",
    media: {
      type: "gallery",
      images: [
        "/feed_3.jpeg",
        "/feed_4.jpeg",
        "/feed_5.jpeg",
        "/feed_2.jpeg",
      ],
      alt: "Campus photography walk gallery",
    },
    time: "3 days ago",
    likes: 124,
    comments: 18,
    shares: 12,
    faculty: null,
    department: null,
    club: "Photography Club",
    type: "club",
    isFollowing: false,
  },
  {
    id: 4,
    author: "University Administration",
    authorRole: "Official",
    authorAvatar: "/avatar.jpeg",
    content:
      "Reminder: The deadline for course registration is this Friday. Please ensure you complete your registration before the deadline to avoid late registration fees.",
    time: "5 days ago",
    likes: 56,
    comments: 42,
    shares: 28,
    faculty: null,
    department: null,
    club: null,
    type: "general",
    isFollowing: true,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"following" | "general">("following")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Filter newsfeed based on user's following status and selected filter
  const filteredNewsfeed = mockNewsfeed.filter((post) => {
    // Apply search filter if query exists
    if (
      searchQuery &&
      !post.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.author.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Apply category filter
    if (filter === "following") return post.isFollowing
    if (filter === "general") return true
    return true
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="sticky top-8 z-10 -mx-4 bg-background/95 backdrop-blur px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Tabs defaultValue="following" onValueChange={(value) => setFilter(value as any)} className="mt-2 mb-8">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4 mt-4">
        {/* Post creation card */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar || "/avatar.jpeg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input placeholder="What's on your mind?" className="mb-2" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Image className="mr-1 h-4 w-4" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Video className="mr-1 h-4 w-4" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Paperclip className="mr-1 h-4 w-4" />
                      Attachment
                    </Button>
                  </div>
                  <Button size="sm">Post</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsfeed posts */}
        {filteredNewsfeed.length > 0 ? (
          filteredNewsfeed.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={post.authorAvatar} alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{post.author}</h3>
                          {post.type === "faculty" && <Badge className="bg-blue-100 text-blue-800">Faculty</Badge>}
                          {post.type === "department" && (
                            <Badge className="bg-purple-100 text-purple-800">Department</Badge>
                          )}
                          {post.type === "club" && <Badge className="bg-green-100 text-green-800">Club</Badge>}
                          {post.type === "general" && <Badge className="bg-gray-100 text-gray-800">General</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {post.authorRole} • {post.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2">{post.content}</p>
                </div>

                {/* Media content */}
                {post.media && (
                  <div className="relative">
                    {post.media.type === "image" && (
                      <img
                        src={post.media.url || "/placeholder.svg"}
                        alt={post.media.alt}
                        className="w-full object-cover max-h-[500px]"
                      />
                    )}
                    {post.media.type === "video" && (
                      <div className="relative">
                        <img
                          src={post.media.thumbnail || "/placeholder.svg"}
                          alt={post.media.alt}
                          className="w-full object-cover max-h-[500px]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full bg-background/80">
                            <Video className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {post.media.type === "gallery" && (
                      <div className="grid grid-cols-2 gap-1">
                        {post.media.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full object-cover h-40"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Post actions */}
                <div className="flex items-center justify-between p-4 border-t">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Heart className="mr-1 h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Share2 className="mr-1 h-4 w-4" />
                    {post.shares}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No posts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {filter === "following"
                  ? "You're not following any clubs or departments yet."
                  : "There are no posts matching your current search."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}

