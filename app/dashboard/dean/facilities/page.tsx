"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar as CalendarIcon, Building, Clock, Users, Filter, CheckCircle, XCircle, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

// Mock data for facility reservations
const mockReservations = [
  {
    id: "1",
    facility: "Science Auditorium",
    club: "Computer Science Club",
    event: "Hackathon",
    date: "2024-05-15",
    timeSlot: "09:00 AM - 05:00 PM",
    capacity: 120,
    attendees: 95,
    status: "approved",
    requestedBy: "John Doe",
  },
  {
    id: "2",
    facility: "Student Center Gallery",
    club: "Photography Society",
    event: "Photo Exhibition",
    date: "2024-05-20",
    timeSlot: "02:00 PM - 06:00 PM",
    capacity: 80,
    attendees: 60,
    status: "approved",
    requestedBy: "Sarah Johnson",
  },
  {
    id: "3",
    facility: "Arts Auditorium",
    club: "Debate Club",
    event: "Inter-Faculty Debate Finals",
    date: "2024-05-12",
    timeSlot: "03:00 PM - 05:00 PM",
    capacity: 200,
    attendees: 180,
    status: "approved",
    requestedBy: "Michael Brown",
  },
  {
    id: "4",
    facility: "University Gymnasium",
    club: "Career Development Office",
    event: "Career Fair 2024",
    date: "2024-06-10",
    timeSlot: "09:00 AM - 03:00 PM",
    capacity: 500,
    attendees: 350,
    status: "pending",
    requestedBy: "Emily Chen",
  },
  {
    id: "5",
    facility: "Student Center Main Hall",
    club: "Environmental Society",
    event: "Climate Change Workshop",
    date: "2024-05-25",
    timeSlot: "01:00 PM - 04:00 PM",
    capacity: 150,
    attendees: 120,
    status: "pending",
    requestedBy: "David Lee",
  },
  {
    id: "6",
    facility: "Engineering Lecture Hall",
    club: "Engineering Society",
    event: "Guest Speaker Series",
    date: "2024-05-18",
    timeSlot: "02:00 PM - 04:00 PM",
    capacity: 100,
    attendees: 85,
    status: "rejected",
    requestedBy: "James Wilson",
    rejectionReason: "Venue already booked for a faculty meeting",
  },
]

// Mock data for facilities
const mockFacilities = [
  {
    id: "f1",
    name: "Science Auditorium",
    location: "Science Complex, Ground Floor",
    capacity: 120,
    amenities: ["Projector", "Sound System", "Air Conditioning", "Podium"],
    availability: "Available",
    maintainedBy: "Facilities Management",
  },
  {
    id: "f2",
    name: "Student Center Gallery",
    location: "Student Center, First Floor",
    capacity: 80,
    amenities: ["Wall Mounts", "Track Lighting", "Open Space", "Security System"],
    availability: "Available",
    maintainedBy: "Student Affairs",
  },
  {
    id: "f3",
    name: "Arts Auditorium",
    location: "Arts Building, Ground Floor",
    capacity: 200,
    amenities: ["Stage", "Projector", "Sound System", "Lighting Setup", "Air Conditioning"],
    availability: "Available",
    maintainedBy: "Facilities Management",
  },
  {
    id: "f4",
    name: "University Gymnasium",
    location: "Sports Complex",
    capacity: 500,
    amenities: ["Basketball Court", "Bleachers", "Sound System", "Changing Rooms"],
    availability: "Available",
    maintainedBy: "Sports Department",
  },
  {
    id: "f5",
    name: "Student Center Main Hall",
    location: "Student Center, Ground Floor",
    capacity: 150,
    amenities: ["Tables and Chairs", "Sound System", "Air Conditioning", "Stage"],
    availability: "Available",
    maintainedBy: "Student Affairs",
  },
  {
    id: "f6",
    name: "Engineering Lecture Hall",
    location: "Engineering Building, Second Floor",
    capacity: 100,
    amenities: ["Projector", "Whiteboard", "Computer", "Air Conditioning"],
    availability: "Under Maintenance",
    maintainedBy: "Facilities Management",
  },
]

export default function DeanFacilitiesPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("reservations")
  const [reservations, setReservations] = useState(mockReservations)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Filter reservations based on search query and active tab
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.event.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all-reservations") return matchesSearch
    if (activeTab === "pending") return matchesSearch && reservation.status === "pending"
    if (activeTab === "approved") return matchesSearch && reservation.status === "approved"
    if (activeTab === "rejected") return matchesSearch && reservation.status === "rejected"
    return matchesSearch
  })

  // Filter facilities based on search query
  const filteredFacilities = mockFacilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const approveReservation = (reservationId: string) => {
    setReservations(
      reservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: "approved" } : reservation,
      ),
    )

    toast({
      title: "Reservation approved",
      description: "The facility reservation has been approved.",
    })
  }

  const rejectReservation = (reservationId: string) => {
    // In a real app, you would prompt for rejection reason
    const rejectionReason = "Schedule conflict with another event"

    setReservations(
      reservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: "rejected", rejectionReason } : reservation,
      ),
    )

    toast({
      title: "Reservation rejected",
      description: "The facility reservation has been rejected.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facility Allocation</h1>
        <p className="text-muted-foreground">Manage and oversee facility reservations for club activities</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search facilities or reservations..."
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

      <Tabs defaultValue="reservations" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reservations">All Reservations</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>Overview of all facility reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReservations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.facility}</TableCell>
                        <TableCell>{reservation.club}</TableCell>
                        <TableCell>{reservation.event}</TableCell>
                        <TableCell>
                          {new Date(reservation.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{reservation.timeSlot}</span>
                        </TableCell>
                        <TableCell>
                          {reservation.attendees}/{reservation.capacity} <br />
                          <span className="text-xs text-muted-foreground">
                            {Math.round((reservation.attendees / reservation.capacity) * 100)}% capacity
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              reservation.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : reservation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {reservation.status}
                          </Badge>
                        </TableCell>
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
                  <Building className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No reservations found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No facility reservations match your current search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Facility reservation requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReservations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.facility}</TableCell>
                        <TableCell>{reservation.club}</TableCell>
                        <TableCell>{reservation.event}</TableCell>
                        <TableCell>
                          {new Date(reservation.date).toLocaleDateString()} <br />
                          <span className="text-xs text-muted-foreground">{reservation.timeSlot}</span>
                        </TableCell>
                        <TableCell>{reservation.requestedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => approveReservation(reservation.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => rejectReservation(reservation.id)}
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
                  <Building className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no facility reservations pending approval at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facilities Management</CardTitle>
              <CardDescription>View and manage available campus facilities</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFacilities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Facility Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Amenities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell>{facility.location}</TableCell>
                        <TableCell>{facility.capacity} people</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {facility.amenities.map((amenity, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              facility.availability === "Available"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {facility.availability}
                          </Badge>
                        </TableCell>
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
                  <Building className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No facilities found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No facilities match your current search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Facility Reservation Calendar</CardTitle>
                  <CardDescription>View reservations by date</CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h3>
                </div>
                {mockReservations
                  .filter((res) => date && res.date === format(date, "yyyy-MM-dd"))
                  .map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden">
                      <div className="flex items-center border-l-4 border-primary p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{reservation.facility}</h4>
                            <Badge
                              variant="outline"
                              className={`${
                                reservation.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : reservation.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {reservation.status}
                            </Badge>
                          </div>
                          <p className="text-sm">
                            {reservation.event} by {reservation.club}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              <span>{reservation.timeSlot}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-3.5 w-3.5" />
                              <span>
                                {reservation.attendees}/{reservation.capacity} attendees
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                {(!date || mockReservations.filter((res) => res.date === format(date, "yyyy-MM-dd")).length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No reservations</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      There are no facility reservations for this date.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

