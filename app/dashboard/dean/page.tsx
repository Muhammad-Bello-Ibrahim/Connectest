"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, CheckCircle, XCircle, FileText, BarChart } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DeanDashboardPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Dean's Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name || "Dean of Student Affairs"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across all faculties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Clubs and events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Club Approvals</CardTitle>
            <CardDescription>Review and approve new club requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingClubs.map((club) => (
                <div key={club.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{club.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {club.faculty} - {club.department}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="sr-only">Reject</span>
                    </Button>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/dean/clubs">
                <Button variant="outline" className="w-full">
                  View All Club Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events requiring approval or monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.name}</p>
                      {event.status === "pending" ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                          Approved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.club} - {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  {event.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Link href="/dashboard/dean/events">
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Club Activity Overview</CardTitle>
          <CardDescription>Engagement metrics across all clubs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Nigeria Association of Computing Student's (NACOS)</p>
                  <div className="text-xs text-muted-foreground">85% active members</div>
                </div>
                <div>120 members</div>
              </div>
              <Progress value={85} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Education Student Association of Nigeria (ESAN)</p>
                  <div className="text-xs text-muted-foreground">72% active members</div>
                </div>
                <div>95 members</div>
              </div>
              <Progress value={72} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Biological Science Student Association (BIOSSA)</p>
                  <div className="text-xs text-muted-foreground">68% active members</div>
                </div>
                <div>78 members</div>
              </div>
              <Progress value={68} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Faculty of Arts and Social Science Student Association (FASSA)</p>
                  <div className="text-xs text-muted-foreground">62% active members</div>
                </div>
                <div>56 members</div>
              </div>
              <Progress value={62} className="h-2 mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Botanical Student Association of Nigeria (BOSAN)</p>
                  <div className="text-xs text-muted-foreground">90% active members</div>
                </div>
                <div>110 members</div>
              </div>
              <Progress value={90} className="h-2 mt-2" />
            </div>
            <Link href="/dashboard/dean/analytics">
              <Button variant="outline" className="w-full">
                <BarChart className="mr-2 h-4 w-4" />
                View Detailed Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

