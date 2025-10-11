"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, Users, Calendar, MessageSquare, 
  ArrowRight, Sparkles, BookOpen, Trophy, Bell
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    myClubs: 0,
    upcomingEvents: 0,
    unreadNotifications: 0,
    recentPosts: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [suggestedClubs, setSuggestedClubs] = useState<any[]>([])

  // Secure redirect for unauthorized users
  useEffect(() => {
    if (!user || user.role !== "student") {
      router.replace("/login")
    }
  }, [user, router])

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's clubs
      const clubsRes = await fetch("/api/auth/user/clubs", { credentials: "include" })
      if (clubsRes.ok) {
        const clubsData = await clubsRes.json()
        setStats(prev => ({ ...prev, myClubs: clubsData.clubs?.length || 0 }))
      }

      // Fetch suggested clubs (clubs user hasn't joined)
      const suggestedRes = await fetch("/api/clubs?limit=3", { credentials: "include" })
      if (suggestedRes.ok) {
        const suggestedData = await suggestedRes.json()
        setSuggestedClubs(suggestedData.clubs?.slice(0, 3) || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  if (!user || user.role !== "student") return null

  const quickActions = [
    {
      title: "Explore Clubs",
      description: "Discover and join clubs",
      icon: Users,
      href: "/dashboard/clubs",
      color: "bg-blue-500",
    },
    {
      title: "Newsfeed",
      description: "See what's happening",
      icon: MessageSquare,
      href: "/dashboard/newsfeed",
      color: "bg-green-500",
    },
    {
      title: "Events",
      description: "Browse upcoming events",
      icon: Calendar,
      href: "/dashboard/events",
      color: "bg-purple-500",
    },
    {
      title: "My Profile",
      description: "Update your information",
      icon: BookOpen,
      href: "/dashboard/profile",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-purple-600 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {user.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  Welcome back, {user.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Sparkles className="h-5 w-5" />
              <p className="text-white/90">
                You're part of <span className="font-bold">{stats.myClubs}</span> clubs
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  My Clubs
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.myClubs}</div>
              <Link href="/dashboard/clubs" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
              <Link href="/dashboard/events" className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-2">
                View calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recent Posts
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recentPosts}</div>
              <Link href="/dashboard/newsfeed" className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-2">
                View feed <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Notifications
                </CardTitle>
                <Bell className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unreadNotifications}</div>
              <Link href="/dashboard/notifications" className="text-xs text-orange-600 hover:underline flex items-center gap-1 mt-2">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Suggested Clubs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Suggested Clubs</CardTitle>
                    <CardDescription>Clubs you might be interested in</CardDescription>
                  </div>
                  <Link href="/dashboard/clubs">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {suggestedClubs.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedClubs.map((club) => (
                      <div key={club._id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {club.abbreviation || club.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{club.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {club.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {club.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {club.members || 0} members
                            </span>
                          </div>
                        </div>
                        <Link href={`/dashboard/clubs/${club._id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No club suggestions available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <Link href="/dashboard/newsfeed">
                      <Button variant="link" size="sm" className="mt-2">
                        Start exploring
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
