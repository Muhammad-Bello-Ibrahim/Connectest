"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, CheckCircle, XCircle, FileText, BarChart } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ClubDashboardPage() {
  const { user } = useAuth()

  // Mock data for pending club approvals
  const pendingClubs = [
    { id: 1, name: "GDG On Campus", faculty: "Science", department: "Computer Science", status: "pending" },
    { id: 2, name: "Jibwis Old Student Association (JOSAG)", faculty: "General", department: "Jibwis students", status: "pending" },
    { id: 3, name: "Bubayero Old Student Association Gombe (BOSAG)", faculty: "General", department: "Bubayero Students", status: "pending" },
  ]

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, name: "Tech Symposium", club: "NACOS", date: "2024-05-15", status: "pending" },
    { id: 2, name: "Literary Festival", club: "English Club", date: "2024-05-20", status: "approved" },
    {
      id: 3,
      name: "Health Awareness Day",
      club: "Medical Students Association",
      date: "2024-05-25",
      status: "pending",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Club Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "Club"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Member Activity</CardTitle>
            <CardDescription>New members and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">New Members This Week</p>
                  <p className="text-sm text-muted-foreground">5 students joined</p>
                </div>
                <Badge className="bg-green-100 text-green-800">+5</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Post Engagement</p>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">142 interactions</Badge>
              </div>
              <Link href="/dashboard/club/members">
                <Button variant="outline" className="w-full">
                  View All Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your club efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Members
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
              <Link href="/dashboard/club/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Update Club Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Engagement Overview</CardTitle>
          <CardDescription>Track how active your members are</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Active Members</p>
                  <div className="text-xs text-muted-foreground">Members who interacted this week</div>
                </div>
                <div>98 of 127 members</div>
              </div>
              <Progress value={77} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Post Interactions</p>
                  <div className="text-xs text-muted-foreground">Likes, comments, and shares</div>
                </div>
                <div>142 interactions</div>
              </div>
              <Progress value={85} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Event Attendance</p>
                  <div className="text-xs text-muted-foreground">Average attendance rate</div>
                </div>
                <div>72%</div>
              </div>
              <Progress value={72} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

