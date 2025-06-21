"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Bell, CheckCircle, Calendar, Users, Vote, CreditCard, Settings } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "New Event: Computer Science Hackathon",
    message: "The Computer Science Club is hosting a hackathon next week. Register now to participate!",
    time: "2 hours ago",
    type: "event",
    read: false,
  },
  {
    id: "2",
    title: "Club Membership Approved",
    message: "Your request to join the Photography Society has been approved.",
    time: "1 day ago",
    type: "club",
    read: false,
  },
  {
    id: "3",
    title: "Payment Reminder",
    message: "This is a reminder to pay your Computer Science Club annual dues by the end of the week.",
    time: "2 days ago",
    type: "payment",
    read: true,
  },
  {
    id: "4",
    title: "Election Results Announced",
    message: "The results for the Student Representative Council elections have been announced. Check them out!",
    time: "3 days ago",
    type: "election",
    read: true,
  },
  {
    id: "5",
    title: "System Maintenance",
    message:
      "Connectrix will be undergoing maintenance this Saturday from 2 AM to 5 AM. Some features may be unavailable during this time.",
    time: "4 days ago",
    type: "system",
    read: true,
  },
  {
    id: "6",
    title: "New Resource Available",
    message: "New lecture materials for CSC 301 have been uploaded to the resources section.",
    time: "5 days ago",
    type: "resource",
    read: true,
  },
  {
    id: "7",
    title: "Profile Update Reminder",
    message: "Please update your profile information to ensure you receive relevant notifications and updates.",
    time: "1 week ago",
    type: "profile",
    read: true,
  },
]

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  // Filter notifications based on search query and active tab
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.read
    if (activeTab === "read") return matchesSearch && notification.read

    return matchesSearch && notification.type === activeTab
  })

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "club":
        return <Users className="h-5 w-5 text-green-500" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-red-500" />
      case "election":
        return <Vote className="h-5 w-5 text-purple-500" />
      case "system":
        return <Settings className="h-5 w-5 text-gray-500" />
      case "resource":
        return <Bell className="h-5 w-5 text-yellow-500" />
      case "profile":
        return <Users className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest activities and announcements</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search notifications..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="club">Clubs</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="election">Elections</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-colors ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div>
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">{notification.message}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0 text-right">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-8" onClick={() => markAsRead(notification.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === "unread"
                    ? "You have no unread notifications."
                    : "No notifications match your current search criteria."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}

