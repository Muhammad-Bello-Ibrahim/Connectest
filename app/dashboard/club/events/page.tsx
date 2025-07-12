"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, XCircle, Calendar, Eye, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for event approval requests
const mockEventRequests = [
  {
    id: "1",
    title: "Computer Science Hackathon",
    description: "Join us for 48 hours of coding, collaboration, and innovation. Prizes for the top three teams!",
    club: "Computer Science Club",
    location: "Science Complex, Room 101",
    date: "2024-05-15",
    time: "09:00 AM - 05:00 PM",
    category: "academic",
    requestedBy: "John Doe",
    requestDate: "2024-05-01",
    status: "pending",
  },
  {
    id: "2",
    title: "Photography Exhibition",
    description: "Showcasing the best student photography from the past year. Refreshments will be provided.",
    club: "Photography Society",
    location: "Student Center Gallery",
    date: "2024-05-20",
    time: "02:00 PM - 06:00 PM",
    category: "cultural",
    requestedBy: "Sarah Johnson",
    requestDate: "2024-05-03",
    status: "pending",
  },
  {
    id: "3",
    title: "Career Fair 2024",
    description: "Connect with potential employers and explore career opportunities.",
    club: "Career Development Office",
    location: "University Gymnasium",
    date: "2024-06-10",
    time: "09:00 AM - 03:00 PM",
    category: "career",
    requestedBy: "Michael Brown",
    requestDate: "2024-05-05",
    status: "pending",
  },
  {
    id: "4",
    title: "Debate Competition Finals",
    description: "Watch the final round of the inter-faculty debate competition.",
    club: "Debate Club",
    location: "Arts Auditorium",
    date: "2024-05-12",
    time: "03:00 PM - 05:00 PM",
    category: "academic",
    requestedBy: "Emily Chen",
    requestDate: "2024-04-28",
    status: "approved",
  },
  {
    id: "5",
    title: "End of Year Party",
    description: "Celebration for the end of the academic year with music and refreshments.",
    club: "Student Representative Council",
    location: "Student Center Main Hall",
    date: "2024-07-15",
    time: "06:00 PM - 10:00 PM",
    category: "social",
    requestedBy: "David Lee",
    requestDate: "2024-04-25",
    status: "rejected",
    rejectionReason: "Date conflicts with examination period",
  },
]

// Mock data for all events
const mockAllEvents = [
  {
    id: "e1",
    title: "Orientation Welcome Party",
    description: "Welcome party for new students. Meet your peers and faculty members.",
    club: "Student Representative Council",
    location: "Student Center Main Hall",
    date: "2024-04-05",
    time: "06:00 PM - 10:00 PM",
    category: "social",
    attendees: 250,
    status: "completed",
  },
  {
    id: "e2",
    title: "Career Fair 2023",
    description: "Connect with potential employers and explore career opportunities.",
    club: "Career Development Office",
    location: "University Gymnasium",
    date: "2023-11-20",
    time: "09:00 AM - 03:00 PM",
    category: "career",
    attendees: 380,
    status: "completed",
  },
  {
    id: "e3",
    title: "Debate Competition Finals",
    description: "Watch the final round of the inter-faculty debate competition.",
    club: "Debate Club",
    location: "Arts Auditorium",
    date: "2024-05-12",
    time: "03:00 PM - 05:00 PM",
    category: "academic",
    attendees: 0,
    status: "upcoming",
  },
]

export default function DeanEventsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [eventRequests, setEventRequests] = useState(mockEventRequests)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectingEventId, setRejectingEventId] = useState<string | null>(null)

  // Filter event requests based on search query and active tab
  const filteredEventRequests = eventRequests.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && event.status === activeTab
  })

  // Filter all events based on search query
  const filteredAllEvents = mockAllEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = (eventId: string) => {
    setEventRequests(eventRequests.map((event) => (event.id === eventId ? { ...event, status: "approved" } : event)))
    toast({
      title: "Event approved",
      description: "The event has been approved successfully.",
    })
  }

  const handleReject = (eventId: string) => {
    if (!rejectionReason) {
      setRejectingEventId(eventId)
      return
    }

    setEventRequests(
      eventRequests.map((event) => (event.id === eventId ? { ...event, status: "rejected", rejectionReason } : event)),
    )
    toast({
      title: "Event rejected",
      description: "The event has been rejected with the provided reason.",
    })
    setRejectionReason("")
    setRejectingEventId(null)
  }

  const confirmReject = () => {
    if (rejectingEventId) {
      handleReject(rejectingEventId)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
        <p className="text-muted-foreground">Review and manage event requests and upcoming events</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all-events">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Event Requests</CardTitle>
              <CardDescription>Review and approve new event requests</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEventRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEventRequests.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.club}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.requestedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleApprove(event.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setRejectingEventId(event.id)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="sr-only">Reject</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no event requests pending approval at the moment.
                  </p>
                </div>
              )}

              {rejectingEventId && (
                <div className="mt-4 rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Provide a reason for rejection</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Reason for rejection"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setRejectingEventId(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason}>
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Events</CardTitle>
              <CardDescription>Events that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEventRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Approval Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEventRequests.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.club}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{new Date(event.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No approved events</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no approved event requests matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Events</CardTitle>
              <CardDescription>Events that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEventRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Rejection Reason</TableHead>
                      <TableHead>Rejection Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEventRequests.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.club}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </TableCell>
                        <TableCell>{event.rejectionReason || "No reason provided"}</TableCell>
                        <TableCell>{new Date(event.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No rejected events</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no rejected event requests matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-events" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Overview of all events</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {filteredAllEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAllEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.club}</TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              event.status === "upcoming"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : event.status === "completed"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No events found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no events matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

