"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, CheckCircle, XCircle, Users, Eye, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for club approval requests
const mockClubRequests = [
  {
    id: "1",
    name: "AI Research Club",
    description: "A club focused on artificial intelligence research and applications.",
    category: "Academic",
    faculty: "Science",
    department: "Computer Science",
    requestedBy: "John Doe",
    requestDate: "2024-05-01",
    status: "pending",
  },
  {
    id: "2",
    name: "Debate Society",
    description: "Enhancing public speaking and critical thinking skills through debates.",
    category: "Academic",
    faculty: "Arts and Social Science",
    department: "Political Science",
    requestedBy: "Sarah Johnson",
    requestDate: "2024-05-03",
    status: "pending",
  },
  {
    id: "3",
    name: "Medical Outreach",
    description: "Providing medical services to underserved communities.",
    category: "Service",
    faculty: "Medical Sciences",
    department: "Medicine",
    requestedBy: "Michael Brown",
    requestDate: "2024-05-05",
    status: "pending",
  },
  {
    id: "4",
    name: "Chess Club",
    description: "For chess enthusiasts of all skill levels.",
    category: "Hobby",
    faculty: null,
    department: null,
    requestedBy: "Emily Chen",
    requestDate: "2024-04-28",
    status: "approved",
  },
  {
    id: "5",
    name: "Dance Troupe",
    description: "Exploring various dance forms and performing at campus events.",
    category: "Cultural",
    faculty: null,
    department: null,
    requestedBy: "David Lee",
    requestDate: "2024-04-25",
    status: "rejected",
    rejectionReason: "Similar club already exists (Performing Arts Club)",
  },
]

// Mock data for all clubs
const mockAllClubs = [
  {
    id: "src",
    name: "Student Representative Council (SRC)",
    description: "The official student government body representing all students.",
    category: "General",
    members: 1248,
    status: "active",
    createdDate: "2020-01-15",
  },
  {
    id: "nass",
    name: "Nigerian Association of Science Students (NASS)",
    description: "Association for all science students.",
    category: "Academic",
    members: 450,
    status: "active",
    createdDate: "2020-02-10",
  },
  {
    id: "nacos",
    name: "Nigerian Association of Computing Students (NACOS)",
    description: "Association for computer science students.",
    category: "Academic",
    members: 120,
    status: "active",
    createdDate: "2020-03-05",
  },
  {
    id: "photography",
    name: "Photography Society",
    description: "For students passionate about photography and visual arts.",
    category: "Hobby",
    members: 28,
    status: "active",
    createdDate: "2023-09-15",
  },
  {
    id: "chess",
    name: "Chess Club",
    description: "For chess enthusiasts of all skill levels.",
    category: "Hobby",
    members: 20,
    status: "active",
    createdDate: "2024-04-30",
  },
]

export default function DeanClubsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [clubRequests, setClubRequests] = useState(mockClubRequests)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectingClubId, setRejectingClubId] = useState<string | null>(null)

  // Filter club requests based on search query and active tab
  const filteredClubRequests = clubRequests.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.faculty && club.faculty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (club.department && club.department.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && club.status === activeTab
  })

  // Filter all clubs based on search query
  const filteredAllClubs = mockAllClubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = (clubId: string) => {
    setClubRequests(clubRequests.map((club) => (club.id === clubId ? { ...club, status: "approved" } : club)))
    toast({
      title: "Club approved",
      description: "The club has been approved successfully.",
    })
  }

  const handleReject = (clubId: string) => {
    if (!rejectionReason) {
      setRejectingClubId(clubId)
      return
    }

    setClubRequests(
      clubRequests.map((club) => (club.id === clubId ? { ...club, status: "rejected", rejectionReason } : club)),
    )
    toast({
      title: "Club rejected",
      description: "The club has been rejected with the provided reason.",
    })
    setRejectionReason("")
    setRejectingClubId(null)
  }

  const confirmReject = () => {
    if (rejectingClubId) {
      handleReject(rejectingClubId)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Club Management</h1>
        <p className="text-muted-foreground">Review and manage club requests and existing clubs</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
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
          <TabsTrigger value="all-clubs">All Clubs</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Club Requests</CardTitle>
              <CardDescription>Review and approve new club requests</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClubRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Faculty/Department</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubRequests.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.category}</TableCell>
                        <TableCell>
                          {club.faculty
                            ? `${club.faculty}${club.department ? ` / ${club.department}` : ""}`
                            : "General"}
                        </TableCell>
                        <TableCell>{club.requestedBy}</TableCell>
                        <TableCell>{new Date(club.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleApprove(club.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setRejectingClubId(club.id)}
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
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no club requests pending approval at the moment.
                  </p>
                </div>
              )}

              {rejectingClubId && (
                <div className="mt-4 rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Provide a reason for rejection</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Reason for rejection"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setRejectingClubId(null)}>
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
              <CardTitle>Approved Clubs</CardTitle>
              <CardDescription>Clubs that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClubRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Faculty/Department</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Approval Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubRequests.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.category}</TableCell>
                        <TableCell>
                          {club.faculty
                            ? `${club.faculty}${club.department ? ` / ${club.department}` : ""}`
                            : "General"}
                        </TableCell>
                        <TableCell>{club.requestedBy}</TableCell>
                        <TableCell>{new Date(club.requestDate).toLocaleDateString()}</TableCell>
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
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No approved clubs</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no approved club requests matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Clubs</CardTitle>
              <CardDescription>Clubs that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClubRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Faculty/Department</TableHead>
                      <TableHead>Rejection Reason</TableHead>
                      <TableHead>Rejection Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubRequests.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.category}</TableCell>
                        <TableCell>
                          {club.faculty
                            ? `${club.faculty}${club.department ? ` / ${club.department}` : ""}`
                            : "General"}
                        </TableCell>
                        <TableCell>{club.rejectionReason || "No reason provided"}</TableCell>
                        <TableCell>{new Date(club.requestDate).toLocaleDateString()}</TableCell>
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
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No rejected clubs</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no rejected club requests matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-clubs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Clubs</CardTitle>
                <CardDescription>Overview of all active clubs</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {filteredAllClubs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAllClubs.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.category}</TableCell>
                        <TableCell>{club.members}</TableCell>
                        <TableCell>{new Date(club.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            {club.status}
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
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No clubs found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no clubs matching your search criteria.
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

