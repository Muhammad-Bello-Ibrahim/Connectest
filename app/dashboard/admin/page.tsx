"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, Settings, Database, Server, Shield, AlertCircle, Activity, CreditCard,
  TrendingUp, TrendingDown, UserPlus, Building2, Calendar, BarChart3, 
  FileText, Bell, CheckCircle2, XCircle, Clock
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    activeEvents: 0,
    pendingApprovals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Mock data for system alerts
  const systemAlerts = [
    { id: 1, type: "warning", message: "Database backup scheduled for tonight at 2 AM", time: "2 hours ago", status: "pending" },
    { id: 2, type: "error", message: "Payment gateway connection error detected", time: "5 hours ago", status: "active" },
    { id: 3, type: "info", message: "System update available (v2.3.1)", time: "1 day ago", status: "resolved" },
  ]

  // Recent activities
  const recentActivities = [
    { id: 1, action: "New user registered", user: "John Doe", time: "5 minutes ago", type: "user" },
    { id: 2, action: "Club created", user: "Tech Club", time: "1 hour ago", type: "club" },
    { id: 3, action: "Event approved", user: "Hackathon 2025", time: "2 hours ago", type: "event" },
    { id: 4, action: "Payment processed", user: "₦15,000", time: "3 hours ago", type: "payment" },
  ]

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            System Administration
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Welcome back, {user?.name || "Administrator"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 md:flex-initial">
            <Bell className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </Button>
          <Button size="sm" className="flex-1 md:flex-initial">
            <FileText className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Generate Report</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : "1,248"}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
            <Progress value={85} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : "87"}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+5 new this month</span>
            </div>
            <Progress value={72} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : "34"}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>15 upcoming this week</span>
            </div>
            <Progress value={60} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "..." : "12"}</div>
            <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-1">
              <Clock className="h-3 w-3" />
              <span>Requires attention</span>
            </div>
            <Link href="/dashboard/admin/approvals">
              <Button variant="link" size="sm" className="px-0 h-auto mt-2">View all →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* System Alerts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="truncate">System Alerts</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Recent system notifications and alerts</CardDescription>
              </div>
              <Badge variant="destructive" className="flex-shrink-0">3</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 md:gap-3 rounded-lg border p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {alert.type === "warning" && (
                      <div className="p-1.5 md:p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    )}
                    {alert.type === "error" && (
                      <div className="p-1.5 md:p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <XCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    {alert.type === "info" && (
                      <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-2">
                      <p className="text-xs md:text-sm font-medium leading-snug">{alert.message}</p>
                      {alert.status === "pending" && <Badge variant="outline" className="text-xs self-start md:self-auto">Pending</Badge>}
                      {alert.status === "active" && <Badge variant="destructive" className="text-xs self-start md:self-auto">Active</Badge>}
                      {alert.status === "resolved" && <Badge variant="secondary" className="text-xs self-start md:self-auto">Resolved</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/admin/alerts">
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View All Alerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="truncate">Recent Activities</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">Latest system activities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 md:gap-3 rounded-lg border p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {activity.type === "user" && (
                      <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {activity.type === "club" && (
                      <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    {activity.type === "event" && (
                      <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    {activity.type === "payment" && (
                      <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <CreditCard className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{activity.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{activity.time}</div>
                </div>
              ))}
              <Link href="/dashboard/admin/activities">
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View All Activities
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Settings className="h-4 w-4 md:h-5 md:w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-xs md:text-sm mt-1">Manage system components and settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/admin/users">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">User Management</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">Manage users & roles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/admin/clubs">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Building2 className="h-5 w-5 md:h-7 md:w-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Club Management</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">Manage clubs & societies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/admin/security">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Shield className="h-5 w-5 md:h-7 md:w-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Security Settings</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">Configure security</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/admin/payments">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <CreditCard className="h-5 w-5 md:h-7 md:w-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Payments</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">Payment configuration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/admin/database">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Database className="h-5 w-5 md:h-7 md:w-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Database</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">Database management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/admin/analytics">
              <Card className="hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-5 w-5 md:h-7 md:w-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Analytics</h3>
                      <p className="text-xs text-muted-foreground mt-1 hidden md:block">View system analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

