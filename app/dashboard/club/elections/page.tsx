"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Vote, AlertCircle, Calendar, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Mock data for elections
const mockElections = [
  {
    id: "1",
    title: "Student Representative Council Presidential Election",
    club: "Student Representative Council (SRC)",
    startDate: "2024-05-10",
    endDate: "2024-05-15",
    status: "active",
    candidates: [
      { id: "c1", name: "John Doe", position: "President", votes: 245 },
      { id: "c2", name: "Sarah Johnson", position: "President", votes: 189 },
      { id: "c3", name: "Michael Brown", position: "President", votes: 156 },
    ],
    totalVotes: 590,
    voterTurnout: 47,
    voterEligibility: 1248,
  },
  {
    id: "2",
    title: "Computer Science Club Leadership Election",
    club: "Computer Science Club",
    startDate: "2024-05-12",
    endDate: "2024-05-18",
    status: "active",
    candidates: [
      { id: "c4", name: "Emily Chen", position: "President", votes: 42 },
      { id: "c5", name: "David Lee", position: "President", votes: 38 },
      { id: "c6", name: "Jessica Wong", position: "Secretary", votes: 51 },
      { id: "c7", name: "Ryan Park", position: "Secretary", votes: 27 },
      { id: "c8", name: "Samantha Miller", position: "Treasurer", votes: 45 },
      { id: "c9", name: "James Wilson", position: "Treasurer", votes: 32 },
    ],
    totalVotes: 235,
    voterTurnout: 65,
    voterEligibility: 360,
  },
  {
    id: "3",
    title: "Photography Society Leadership Election",
    club: "Photography Society",
    startDate: "2024-04-20",
    endDate: "2024-04-25",
    status: "completed",
    candidates: [
      { id: "c10", name: "Olivia Martinez", position: "President", votes: 18, winner: true },
      { id: "c11", name: "Daniel Taylor", position: "President", votes: 14 },
      { id: "c12", name: "Sophia Brown", position: "Secretary", votes: 21, winner: true },
      { id: "c13", name: "Noah Garcia", position: "Secretary", votes: 11 },
    ],
    totalVotes: 64,
    voterTurnout: 78,
    voterEligibility: 82,
  },
  {
    id: "4",
    title: "Nigerian Association of Science Students Election",
    club: "Nigerian Association of Science Students (NASS)",
    startDate: "2024-05-25",
    endDate: "2024-05-30",
    status: "pending",
    candidates: [
      { id: "c14", name: "Alexander Johnson", position: "President", votes: 0 },
      { id: "c15", name: "Isabella Williams", position: "President", votes: 0 },
      { id: "c16", name: "William Davis", position: "President", votes: 0 },
      { id: "c17", name: "Emma Thompson", position: "Secretary", votes: 0 },
      { id: "c18", name: "James Anderson", position: "Secretary", votes: 0 },
    ],
    totalVotes: 0,
    voterTurnout: 0,
    voterEligibility: 450,
  },
  {
    id: "5",
    title: "Debate Club Leadership Election",
    club: "Debate Club",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    status: "completed",
    candidates: [
      { id: "c19", name: "Liam Roberts", position: "President", votes: 16, winner: true },
      { id: "c20", name: "Charlotte Mitchell", position: "President", votes: 13 },
      { id: "c21", name: "Benjamin Cooper", position: "Vice President", votes: 19, winner: true },
      { id: "c22", name: "Amelia Turner", position: "Vice President", votes: 10 },
    ],
    totalVotes: 58,
    voterTurnout: 82,
    voterEligibility: 71,
  },
]

// Mock election requests
const mockElectionRequests = [
  {
    id: "r1",
    title: "Drama Club Leadership Election",
    club: "Drama Club",
    requestedBy: "Alice Johnson (Club Secretary)",
    positions: ["President", "Secretary", "Treasurer"],
    requestDate: "2024-05-01",
    proposedStartDate: "2024-06-05",
    proposedEndDate: "2024-06-10",
    status: "pending",
  },
  {
    id: "r2",
    title: "Environmental Society Committee Election",
    club: "Environmental Society",
    requestedBy: "Thomas Brown (Club Coordinator)",
    positions: ["Chairperson", "Secretary", "Outreach Coordinator", "Treasurer"],
    requestDate: "2024-05-02",
    proposedStartDate: "2024-06-01",
    proposedEndDate: "2024-06-05",
    status: "pending",
  },
]

export default function DeanElectionsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [electionRequests, setElectionRequests] = useState(mockElectionRequests)

  // Filter elections based on search query and active tab
  const filteredElections = mockElections.filter((election) => {
    const matchesSearch =
      election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      election.club.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && election.status === activeTab
  })

  // Filter election requests
  const filteredRequests = electionRequests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.club.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const approveElectionRequest = (requestId: string) => {
    setElectionRequests(
      electionRequests.map((request) => (request.id === requestId ? { ...request, status: "approved" } : request)),
    )

    toast({
      title: "Election request approved",
      description: "The election request has been approved and scheduled.",
    })
  }

  const rejectElectionRequest = (requestId: string) => {
    setElectionRequests(
      electionRequests.map((request) => (request.id === requestId ? { ...request, status: "rejected" } : request)),
    )

    toast({
      title: "Election request rejected",
      description: "The election request has been rejected.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Election Management</h1>
        <p className="text-muted-foreground">Monitor and manage club elections across campus</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elections..."
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

      <Tabs defaultValue="active" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="pending">Pending Elections</TabsTrigger>
          <TabsTrigger value="completed">Completed Elections</TabsTrigger>
          <TabsTrigger value="requests">Election Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Currently ongoing elections across campus clubs</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredElections.length > 0 ? (
                <div className="space-y-6">
                  {filteredElections.map((election) => (
                    <Card key={election.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{election.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Active
                          </Badge>
                        </div>
                        <CardDescription>{election.club}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(election.startDate).toLocaleDateString()} -{" "}
                              {new Date(election.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Vote className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {election.totalVotes} votes cast ({election.voterTurnout}% turnout)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Candidates by Position</h4>

                          {/* Group candidates by position */}
                          {Array.from(new Set(election.candidates.map((c) => c.position))).map((position) => (
                            <div key={position} className="space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground">{position}</h5>
                              {election.candidates
                                .filter((c) => c.position === position)
                                .map((candidate) => (
                                  <div key={candidate.id} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{candidate.name}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {Math.round((candidate.votes / (election.totalVotes || 1)) * 100)}% (
                                        {candidate.votes} votes)
                                      </span>
                                    </div>
                                    <Progress
                                      value={(candidate.votes / (election.totalVotes || 1)) * 100}
                                      className="h-2"
                                    />
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <div className="flex justify-end p-4 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Vote className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No active elections</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no active elections matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Elections</CardTitle>
              <CardDescription>Elections scheduled to start in the future</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredElections.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Election Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Candidates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredElections.map((election) => (
                      <TableRow key={election.id}>
                        <TableCell className="font-medium">{election.title}</TableCell>
                        <TableCell>{election.club}</TableCell>
                        <TableCell>{new Date(election.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(election.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{election.candidates.length}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            Pending
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
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No pending elections</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no pending elections matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Elections</CardTitle>
              <CardDescription>Past elections with final results</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredElections.length > 0 ? (
                <div className="space-y-6">
                  {filteredElections.map((election) => (
                    <Card key={election.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{election.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          >
                            Completed
                          </Badge>
                        </div>
                        <CardDescription>{election.club}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(election.startDate).toLocaleDateString()} -{" "}
                              {new Date(election.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Vote className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>
                              {election.totalVotes} votes cast ({election.voterTurnout}% turnout)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Results by Position</h4>

                          {/* Group candidates by position */}
                          {Array.from(new Set(election.candidates.map((c) => c.position))).map((position) => (
                            <div key={position} className="space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground">{position}</h5>
                              {election.candidates
                                .filter((c) => c.position === position)
                                .map((candidate) => (
                                  <div key={candidate.id} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {candidate.name}
                                        {candidate.winner && (
                                          <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            Winner
                                          </Badge>
                                        )}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {Math.round((candidate.votes / (election.totalVotes || 1)) * 100)}% (
                                        {candidate.votes} votes)
                                      </span>
                                    </div>
                                    <Progress
                                      value={(candidate.votes / (election.totalVotes || 1)) * 100}
                                      className={`h-2 ${candidate.winner ? "bg-primary" : ""}`}
                                    />
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <div className="flex justify-end p-4 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Results
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Vote className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No completed elections</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no completed elections matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Election Requests</CardTitle>
              <CardDescription>Review and approve election requests from clubs</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Election Title</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Proposed Dates</TableHead>
                      <TableHead>Positions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>{request.club}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>
                          {new Date(request.proposedStartDate).toLocaleDateString()} -{" "}
                          {new Date(request.proposedEndDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {request.positions.map((position, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {position}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => approveElectionRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => rejectElectionRequest(request.id)}
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
                  <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No election requests</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    There are no election requests pending approval at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockElections.filter((e) => e.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Across all clubs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Elections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockElections.filter((e) => e.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Scheduled to start soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Turnout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockElections.reduce((sum, e) => sum + e.voterTurnout, 0) / mockElections.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all elections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockElections.reduce((sum, e) => sum + e.totalVotes, 0)}</div>
            <p className="text-xs text-muted-foreground">In all elections</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

