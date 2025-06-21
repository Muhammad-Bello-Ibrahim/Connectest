"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Printer, Mail, LineChart, Calendar, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Mock data for reports
const mockReports = [
  {
    id: "1",
    title: "Monthly Club Activity Report",
    description: "Summary of all club activities for the month of April 2024",
    date: "2024-05-01",
    type: "monthly",
    status: "generated",
    format: "pdf",
    size: "1.2 MB",
  },
  {
    id: "2",
    title: "Election Results - Student Representative Council",
    description: "Final results and analysis of the SRC elections",
    date: "2024-04-16",
    type: "election",
    status: "generated",
    format: "pdf",
    size: "2.8 MB",
  },
  {
    id: "3",
    title: "Club Membership Quarterly Report",
    description: "Analysis of club membership trends and engagement over Q1 2024",
    date: "2024-04-05",
    type: "quarterly",
    status: "generated",
    format: "xlsx",
    size: "3.5 MB",
  },
  {
    id: "4",
    title: "Event Attendance Analysis",
    description: "Detailed analysis of student attendance at campus events",
    date: "2024-03-28",
    type: "custom",
    status: "generated",
    format: "pdf",
    size: "4.2 MB",
  },
  {
    id: "5",
    title: "Annual Club Performance Review",
    description: "End of year performance review for all registered clubs (2023)",
    date: "2024-01-15",
    type: "annual",
    status: "generated",
    format: "pdf",
    size: "5.7 MB",
  },
]

// Mock data for club activity
const mockClubActivity = [
  {
    club: "Computer Science Club",
    events: 12,
    members: 120,
    attendance: 76,
    engagement: 68,
  },
  {
    club: "Photography Society",
    events: 8,
    members: 35,
    attendance: 82,
    engagement: 75,
  },
  {
    club: "Debate Club",
    events: 6,
    members: 42,
    attendance: 88,
    engagement: 72,
  },
  {
    club: "Nigerian Association of Science Students",
    events: 15,
    members: 450,
    attendance: 65,
    engagement: 58,
  },
  {
    club: "Student Representative Council",
    events: 22,
    members: 1248,
    attendance: 42,
    engagement: 51,
  },
]

// Mock scheduled reports
const mockScheduledReports = [
  {
    id: "s1",
    title: "Monthly Club Activity Report - May 2024",
    schedule: "Monthly (1st of every month)",
    nextGeneration: "2024-06-01",
    recipients: ["dean@example.com", "clubcoordinator@example.com"],
    format: "pdf",
  },
  {
    id: "s2",
    title: "Club Membership Quarterly Report - Q2 2024",
    schedule: "Quarterly (5th of Apr, Jul, Oct, Jan)",
    nextGeneration: "2024-07-05",
    recipients: ["dean@example.com", "registrar@example.com"],
    format: "xlsx",
  },
  {
    id: "s3",
    title: "Weekly Event Summary",
    schedule: "Weekly (Every Monday)",
    nextGeneration: "2024-05-13",
    recipients: ["eventcoordinator@example.com", "dean@example.com"],
    format: "pdf",
  },
]

export default function DeanReportsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("generated")

  // Filter reports based on search query
  const filteredReports = mockReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter scheduled reports based on search query
  const filteredScheduledReports = mockScheduledReports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const downloadReport = (reportId: string) => {
    const report = mockReports.find((r) => r.id === reportId)
    toast({
      title: "Download started",
      description: `Downloading ${report?.title} (${report?.size})`,
    })
  }

  const emailReport = (reportId: string) => {
    toast({
      title: "Report sent",
      description: "The report has been emailed to your address",
    })
  }

  const printReport = (reportId: string) => {
    toast({
      title: "Print job started",
      description: "The report has been sent to the printer",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View, generate, and manage reports about campus club activities</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="sm" className="h-9 gap-1">
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <Tabs defaultValue="generated" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="activity">Club Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Access and download previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Title</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-xs text-muted-foreground">{report.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="uppercase">{report.format}</TableCell>
                        <TableCell>{report.size}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => downloadReport(report.id)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => emailReport(report.id)}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Email</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => printReport(report.id)}
                            >
                              <Printer className="h-4 w-4" />
                              <span className="sr-only">Print</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No reports found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No reports match your current search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage automatically generated recurring reports</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredScheduledReports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Title</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Next Generation</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{report.schedule}</TableCell>
                        <TableCell>{new Date(report.nextGeneration).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {report.recipients.map((email, idx) => (
                            <div key={idx} className="text-xs">
                              {email}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="uppercase">{report.format}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              Delete
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
                  <h3 className="mt-4 text-lg font-medium">No scheduled reports</h3>
                  <p className="mt-2 text-sm text-muted-foreground">You don't have any scheduled reports set up yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule a New Report</CardTitle>
              <CardDescription>Create a new recurring report schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="report-type" className="block text-sm font-medium mb-1">
                      Report Type
                    </label>
                    <Select>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club-activity">Club Activity Report</SelectItem>
                        <SelectItem value="membership">Membership Report</SelectItem>
                        <SelectItem value="event-attendance">Event Attendance Report</SelectItem>
                        <SelectItem value="election">Election Results Report</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium mb-1">
                      Frequency
                    </label>
                    <Select>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="recipients" className="block text-sm font-medium mb-1">
                    Recipients (comma separated)
                  </label>
                  <Input id="recipients" placeholder="email1@example.com, email2@example.com" />
                </div>

                <div>
                  <label htmlFor="report-format" className="block text-sm font-medium mb-1">
                    Format
                  </label>
                  <Select>
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full mt-2">Schedule Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Club Activity Analytics</CardTitle>
                  <CardDescription>Overview of club activity and engagement metrics</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="thisMonth">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisQuarter">This Quarter</SelectItem>
                      <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              <div className="rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Avg. Attendance</TableHead>
                      <TableHead className="text-right">Engagement Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClubActivity.map((club, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{club.club}</TableCell>
                        <TableCell>{club.events}</TableCell>
                        <TableCell>{club.members}</TableCell>
                        <TableCell>{club.attendance}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={club.engagement} className="h-2 w-[100px]" />
                            <span className="w-10 text-sm">{club.engagement}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Student Engagement by Faculty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Bar chart showing engagement by faculty)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Event Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Line chart showing attendance trends over time)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Events by Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Computer Science Hackathon</span>
                      <Badge variant="outline">Computer Science Club</Badge>
                    </div>
                    <span>92% attendance</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Photography Exhibition</span>
                      <Badge variant="outline">Photography Society</Badge>
                    </div>
                    <span>88% attendance</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Inter-Faculty Debate Finals</span>
                      <Badge variant="outline">Debate Club</Badge>
                    </div>
                    <span>85% attendance</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Career Fair 2024</span>
                      <Badge variant="outline">Career Development Office</Badge>
                    </div>
                    <span>82% attendance</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Environmental Awareness Day</span>
                      <Badge variant="outline">Environmental Society</Badge>
                    </div>
                    <span>79% attendance</span>
                  </div>
                  <Progress value={79} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

