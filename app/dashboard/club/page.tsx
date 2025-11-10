"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Users, FileText, TrendingUp, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ClubStats {
  totalPosts: number
  totalMembers: number
  recentActivity: number
}

interface ClubInfo {
  _id: string
  name: string
  email?: string
  abbreviation?: string
  description?: string
  logo?: string
  type: string
  members: number
  status: string
}

export default function ClubDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
  const [stats, setStats] = useState<ClubStats>({
    totalPosts: 0,
    totalMembers: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
      return
    }

    if (!isLoading && user?.role !== "club") {
      router.replace("/dashboard")
      return
    }

    if (user?.role === "club" && user?.email) {
      fetchClubInfo()
    }
  }, [user, isLoading, router])

  const fetchClubInfo = async () => {
    try {
      setLoading(true)
      
      // Fetch clubs and find the one matching the user's email
      const response = await fetch('/api/clubs')
      if (!response.ok) {
        throw new Error('Failed to fetch club information')
      }
      
      const data = await response.json()
      const userClub = data.clubs.find((club: ClubInfo) => 
        club.email?.toLowerCase() === user?.email?.toLowerCase()
      )
      
      if (userClub) {
        setClubInfo(userClub)
        
        // Fetch posts count for this club
        try {
          const postsResponse = await fetch(`/api/posts?club=${userClub._id}`)
          if (postsResponse.ok) {
            const postsData = await postsResponse.json()
            setStats(prev => ({
              ...prev,
              totalPosts: postsData.pagination?.total || 0,
              totalMembers: userClub.members || 0,
              recentActivity: postsData.posts?.length || 0
            }))
          }
        } catch (error) {
          console.error('Error fetching posts:', error)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Club information not found"
        })
      }
    } catch (error) {
      console.error('Error fetching club info:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load club information"
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!clubInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Club Not Found</CardTitle>
            <CardDescription>
              Unable to load club information. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 md:h-20 md:w-20">
            <AvatarImage src={clubInfo.logo} alt={clubInfo.name} />
            <AvatarFallback className="text-xl md:text-2xl">
              {clubInfo.abbreviation || clubInfo.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{clubInfo.name}</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {clubInfo.description || `${clubInfo.type} Club`}
            </p>
          </div>
        </div>
        <Link href="/dashboard/compose">
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published posts by your club
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Club members registered
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Recent posts and updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your club efficiently</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/club/members" className="w-full">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>View Members</span>
            </Button>
          </Link>
          <Link href="/dashboard/compose" className="w-full">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Create Post</span>
            </Button>
          </Link>
          <Link href="/dashboard/club/profile" className="w-full">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Edit Profile</span>
            </Button>
          </Link>
          <Link href="/dashboard/club/settings" className="w-full">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your latest club updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent posts to display</p>
            <Link href="/dashboard/compose">
              <Button variant="link" className="mt-2">
                Create your first post
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

