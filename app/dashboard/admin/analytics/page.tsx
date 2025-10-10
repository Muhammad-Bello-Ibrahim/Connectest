"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart3, TrendingUp, Users, Building2, Calendar, Activity,
  ArrowUp, ArrowDown, Eye, UserPlus, LogIn
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AnalyticsPage() {
  // Mock analytics data
  const userGrowth = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 180 },
    { month: "Mar", users: 250 },
    { month: "Apr", users: 340 },
    { month: "May", users: 420 },
  ]

  const topClubs = [
    { name: "Google Developer Group", members: 245, growth: 12 },
    { name: "NACOS", members: 198, growth: 8 },
    { name: "Engineering Society", members: 167, growth: 15 },
    { name: "Medical Students Association", members: 143, growth: 5 },
    { name: "Debate Club", members: 98, growth: -3 },
  ]

  const recentActivity = [
    { action: "New user registration", count: 45, change: 12 },
    { action: "Club memberships", count: 78, change: 23 },
    { action: "Events created", count: 12, change: 4 },
    { action: "Active sessions", count: 234, change: -8 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">System performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24,567</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+420</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3" />
              <span>+18% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68.4%</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUp className="h-3 w-3" />
              <span>+5.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12m 34s</div>
            <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
              <ArrowDown className="h-3 w-3" />
              <span>-2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Growth Trend
            </CardTitle>
            <CardDescription>Monthly user registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userGrowth.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.month}</span>
                    <span className="text-muted-foreground">{item.users} users</span>
                  </div>
                  <Progress value={(item.users / 500) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clubs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Performing Clubs
            </CardTitle>
            <CardDescription>By member count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{club.name}</div>
                      <div className="text-sm text-muted-foreground">{club.members} members</div>
                    </div>
                  </div>
                  <Badge variant={club.growth > 0 ? "default" : "destructive"} className="gap-1">
                    {club.growth > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(club.growth)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Overview
          </CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-1">{activity.action}</div>
                <div className="text-2xl font-bold">{activity.count}</div>
                <div className={`flex items-center gap-1 text-xs mt-1 ${activity.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {activity.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  <span>{Math.abs(activity.change)}% change</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
