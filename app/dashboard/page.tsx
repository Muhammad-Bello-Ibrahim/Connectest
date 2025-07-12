"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MessageCircle,
  Calendar,
  TrendingUp,
  Star,
  MapPin,
  BookOpen,
  Heart
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [clubs, setClubs] = useState<any[]>([])
  const [recommendedClubs, setRecommendedClubs] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Secure redirect for unauthorized or wrong-role users
  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.replace("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user's clubs
      const clubsRes = await fetch("/api/auth/user/clubs", { credentials: "include" })
      if (clubsRes.ok) {
        const clubsData = await clubsRes.json()
        setClubs(clubsData)
      }

      // Mock recommended clubs based on user profile
      const mockRecommended = [
        {
          _id: "1",
          name: "Nigeria Association of Computing Students",
          abbreviation: "NACOS",
          type: "academic",
          faculty: user?.faculty,
          department: user?.department,
          members: 127,
          matchReason: "Same department"
        },
        {
          _id: "2", 
          name: "Gombe State Student Association",
          abbreviation: "GSSA",
          type: "state",
          state: user?.state,
          members: 89,
          matchReason: "Same state"
        }
      ]
      setRecommendedClubs(mockRecommended)

      // Mock recent activity
      const mockActivity = [
        {
          id: "1",
          type: "club_joined",
          message: "You joined NACOS",
          time: "2 hours ago",
          icon: Users
        },
        {
          id: "2",
          type: "post_liked",
          message: "Your post received 15 likes",
          time: "1 day ago", 
          icon: Heart
        }
      ]
      setRecentActivity(mockActivity)

    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  if (!user || user.role !== "student") return null

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            Discover clubs and connect with your university community
          </p>
        </div>
        <Avatar className="h-12 w-12">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubs.length}</div>
            <p className="text-xs text-muted-foreground">Active memberships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">Active participant</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Clubs */}
        <Card>
          <CardHeader>
            <CardTitle>My Clubs</CardTitle>
            <CardDescription>Clubs you're currently a member of</CardDescription>
          </CardHeader>
          <CardContent>
            {clubs.length > 0 ? (
              <div className="space-y-3">
                {clubs.slice(0, 3).map((club) => (
                  <div key={club._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{club.abbreviation || club.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{club.name}</p>
                        <p className="text-sm text-muted-foreground">{club.members} members</p>
                      </div>
                    </div>
                    <Badge variant="outline">{club.type}</Badge>
                  </div>
                ))}
                <Link href="/dashboard/clubs">
                  <Button variant="outline" className="w-full">View All Clubs</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No clubs yet</h3>
                <p className="text-muted-foreground mb-4">Join clubs that match your interests</p>
                <Link href="/dashboard/clubs">
                  <Button>Explore Clubs</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Clubs */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Clubs that match your profile and interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendedClubs.map((club) => (
                <div key={club._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{club.abbreviation || club.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{club.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{club.matchReason}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              ))}
              <Link href="/dashboard/clubs">
                <Button variant="outline" className="w-full">See More Recommendations</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No recent activity</h3>
                <p className="text-muted-foreground">Start engaging with clubs to see activity here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link href="/dashboard/clubs">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Clubs
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
              <Link href="/dashboard/newsfeed">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  View Newsfeed
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}