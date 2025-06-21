"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Download, BookOpen, Map, Building, ExternalLink } from "lucide-react"

// Mock data for resources
const mockLectureMaterials = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    course: "CSC 101",
    type: "Lecture Notes",
    uploadedBy: "Dr. Johnson",
    uploadDate: "2024-03-15",
    fileSize: "2.4 MB",
    downloads: 145,
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    course: "CSC 202",
    type: "Lecture Slides",
    uploadedBy: "Prof. Williams",
    uploadDate: "2024-04-02",
    fileSize: "5.1 MB",
    downloads: 98,
  },
  {
    id: "3",
    title: "Database Management Systems",
    course: "CSC 301",
    type: "Lecture Notes",
    uploadedBy: "Dr. Martinez",
    uploadDate: "2024-04-10",
    fileSize: "3.7 MB",
    downloads: 112,
  },
]

const mockPastQuestions = [
  {
    id: "4",
    title: "Computer Science 2023 Final Exam",
    course: "CSC 101",
    year: "2023",
    semester: "Second",
    uploadedBy: "Student Council",
    fileSize: "1.2 MB",
    downloads: 210,
  },
  {
    id: "5",
    title: "Data Structures Mid-Term Exam",
    course: "CSC 202",
    year: "2023",
    semester: "First",
    uploadedBy: "Student Council",
    fileSize: "0.8 MB",
    downloads: 175,
  },
]

// Mock data for campus locations
const mockCampusLocations = [
  {
    id: "1",
    name: "Science Complex",
    type: "Academic Building",
    description: "Houses the departments of Computer Science, Physics, and Chemistry",
    floors: 4,
    facilities: ["Lecture Halls", "Laboratories", "Faculty Offices"],
  },
  {
    id: "2",
    name: "University Library",
    type: "Library",
    description: "Main library with study spaces and extensive collection of books",
    floors: 3,
    facilities: ["Reading Rooms", "Computer Lab", "Group Study Rooms"],
  },
  {
    id: "3",
    name: "Student Center",
    type: "Administrative",
    description: "Central hub for student services and activities",
    floors: 2,
    facilities: ["Cafeteria", "Student Affairs Office", "Club Meeting Rooms"],
  },
  {
    id: "4",
    name: "Engineering Building",
    type: "Academic Building",
    description: "Home to all engineering departments and labs",
    floors: 5,
    facilities: ["Workshops", "Design Studios", "Research Labs"],
  },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter resources based on search query
  const filteredLectureMaterials = mockLectureMaterials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPastQuestions = mockPastQuestions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCampusLocations = mockCampusLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campus Resources</h1>
        <p className="text-muted-foreground">Access lecture materials, past questions, and campus navigation</p>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resources..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Lecture Materials</TabsTrigger>
          <TabsTrigger value="past-questions">Past Questions</TabsTrigger>
          <TabsTrigger value="campus-map">Campus Map</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Materials</CardTitle>
              <CardDescription>Access lecture notes, slides, and other course materials</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLectureMaterials.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLectureMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>{material.course}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <FileText className="mr-1 h-3 w-3" />
                            {material.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.uploadedBy}</TableCell>
                        <TableCell>{new Date(material.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>{material.fileSize}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No materials found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or check back later for new uploads.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past-questions">
          <Card>
            <CardHeader>
              <CardTitle>Past Questions</CardTitle>
              <CardDescription>Access previous exam questions and practice materials</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPastQuestions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPastQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.title}</TableCell>
                        <TableCell>{question.course}</TableCell>
                        <TableCell>{question.year}</TableCell>
                        <TableCell>{question.semester}</TableCell>
                        <TableCell>{question.fileSize}</TableCell>
                        <TableCell>{question.downloads}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No past questions found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or check back later for new uploads.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campus-map">
          <Card>
            <CardHeader>
              <CardTitle>Campus Map</CardTitle>
              <CardDescription>Find your way around campus with building information and directions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-card p-4 text-center">
                <Map className="mx-auto h-16 w-16 text-muted-foreground/70" />
                <h3 className="mt-2 text-lg font-medium">Interactive Campus Map</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click on a building to see more details and get directions
                </p>
                <Button className="mt-4">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Full Map
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Campus Buildings</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredCampusLocations.map((location) => (
                    <Card key={location.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{location.name}</CardTitle>
                          <Badge variant="outline">
                            <Building className="mr-1 h-3 w-3" />
                            {location.type}
                          </Badge>
                        </div>
                        <CardDescription>{location.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Floors:</span>
                            <span>{location.floors}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-muted-foreground">Facilities:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {location.facilities.map((facility, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Get Directions
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

