"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, Lock, Key, AlertTriangle, CheckCircle2, Eye, History,
  UserX, Bell, Database, Server
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function SecurityPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: true,
    sessionTimeout: true,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    ipWhitelisting: false,
    bruteForceProtection: true,
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
    toast({
      title: "Setting Updated",
      description: "Security setting has been changed successfully.",
    })
  }

  const securityLogs = [
    { id: 1, action: "Failed login attempt", user: "admin@example.com", ip: "192.168.1.1", time: "2 hours ago", severity: "warning" },
    { id: 2, action: "Password changed", user: "john.doe@example.com", ip: "192.168.1.5", time: "5 hours ago", severity: "info" },
    { id: 3, action: "Multiple failed logins", user: "unknown@example.com", ip: "10.0.0.1", time: "1 day ago", severity: "error" },
    { id: 4, action: "New device login", user: "sarah.j@example.com", ip: "192.168.1.10", time: "2 days ago", severity: "info" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage system security and access controls</p>
      </div>

      {/* Security Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">85/100</div>
            <p className="text-xs text-muted-foreground mt-1">Good security posture</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Security Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2 days</div>
            <p className="text-xs text-muted-foreground mt-1">ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>Configure authentication and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password Expiry</Label>
                <p className="text-sm text-muted-foreground">Force password change every 90 days</p>
              </div>
              <Switch
                checked={settings.passwordExpiry}
                onCheckedChange={() => handleToggle('passwordExpiry')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
              </div>
              <Switch
                checked={settings.sessionTimeout}
                onCheckedChange={() => handleToggle('sessionTimeout')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Monitoring & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Monitoring & Alerts
            </CardTitle>
            <CardDescription>Configure security monitoring and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Email alerts for new logins</p>
              </div>
              <Switch
                checked={settings.loginNotifications}
                onCheckedChange={() => handleToggle('loginNotifications')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Suspicious Activity Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert on unusual account activity</p>
              </div>
              <Switch
                checked={settings.suspiciousActivityAlerts}
                onCheckedChange={() => handleToggle('suspiciousActivityAlerts')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Brute Force Protection</Label>
                <p className="text-sm text-muted-foreground">Block IPs after failed login attempts</p>
              </div>
              <Switch
                checked={settings.bruteForceProtection}
                onCheckedChange={() => handleToggle('bruteForceProtection')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Security Logs
              </CardTitle>
              <CardDescription>Recent security events and activities</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {log.severity === "error" && (
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  {log.severity === "warning" && (
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  )}
                  {log.severity === "info" && (
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        User: {log.user} • IP: {log.ip}
                      </p>
                    </div>
                    <Badge variant={
                      log.severity === "error" ? "destructive" : 
                      log.severity === "warning" ? "outline" : 
                      "secondary"
                    }>
                      {log.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common security tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Key className="h-4 w-4 mr-2" />
              Reset All Passwords
            </Button>
            <Button variant="outline" className="justify-start">
              <UserX className="h-4 w-4 mr-2" />
              Revoke All Sessions
            </Button>
            <Button variant="outline" className="justify-start">
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button variant="outline" className="justify-start">
              <Server className="h-4 w-4 mr-2" />
              Run Security Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
