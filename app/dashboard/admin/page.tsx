"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Settings, Database, Server, Shield, AlertCircle, Activity, CreditCard } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  const { user } = useAuth()

  // Mock data for system alerts
  const systemAlerts = [
    { id: 1, type: "warning", message: "Database backup scheduled for tonight at 2 AM", time: "2 hours ago" },
    { id: 2, type: "error", message: "Payment gateway connection error detected", time: "5 hours ago" },
    { id: 3, type: "info", message: "System update available (v2.3.1)", time: "1 day ago" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground">Welcome, {user?.name || "System Administrator"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-emerald-500"></div>
              <div className="text-2xl font-bold">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground">All systems running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">2.4 GB of 3.5 GB used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">Current active users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-3">
                  {alert.type === "warning" && <AlertCircle className="mt-1 h-5 w-5 text-yellow-500" />}
                  {alert.type === "error" && <AlertCircle className="mt-1 h-5 w-5 text-red-500" />}
                  {alert.type === "info" && <AlertCircle className="mt-1 h-5 w-5 text-blue-500" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.message}</p>
                      {alert.type === "warning" && <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>}
                      {alert.type === "error" && <Badge className="bg-red-100 text-red-800">Error</Badge>}
                      {alert.type === "info" && <Badge className="bg-blue-100 text-blue-800">Info</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/admin/alerts">
                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Computer Science Club Dues</p>
                  <p className="text-sm text-muted-foreground">15 transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦22,500</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Engineering Society Registration</p>
                  <p className="text-sm text-muted-foreground">8 transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦12,000</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Sports Club Event Fees</p>
                  <p className="text-sm text-muted-foreground">23 transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦34,500</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <Link href="/dashboard/admin/transactions">
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  View All Transactions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Quick access to system settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6 text-emerald-600" />
                <span>User Management</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/security">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span>Security Settings</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/payments">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <CreditCard className="h-6 w-6 text-emerald-600" />
                <span>Payment Configuration</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/database">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Database className="h-6 w-6 text-emerald-600" />
                <span>Database Management</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/system">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Server className="h-6 w-6 text-emerald-600" />
                <span>System Maintenance</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/settings">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Settings className="h-6 w-6 text-emerald-600" />
                <span>General Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

