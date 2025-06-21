"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Search, Plus, Filter, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Computer Science Hackathon",
    description: "Join us for 48 hours of coding, collaboration, and innovation. Prizes for the top three teams!",
    club: "Computer Science Club",
    location: "Science Complex, Room 101",
    date: "2024-05-15",
    time: "09:00 AM - 05:00 PM",
    attendees: 42,
    interested: 78,
    image: "/placeholder.svg?height=200&width=400",
    category: "academic",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Photography Exhibition",
    description: "Showcasing the best student photography from the past year. Refreshments will be provided.",
    club: "Photography Society",
    location: "Student Center Gallery",
    date: "2024-05-20",
    time: "02:00 PM - 06:00 PM",
    attendees: 35,
    interested: 62,
    image: "/placeholder.svg?height=200&width=400",
    category: "cultural",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Annual Science Fair",
    description: "Explore innovative projects from students across all science departments.",
    club: "Science Faculty",
    location: "Science Complex Auditorium",
    date: "2024-06-10",
    time: "10:00 AM - 04:00 PM",
    attendees: 120,
    interested: 210,
    image: "/placeholder.svg?height=200&width=400",
    category: "academic",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Debate Competition Finals",
    description: "Watch the final round of the inter-faculty debate competition.",
    club: "Debate Club",
    location: "Arts Auditorium",
    date: "2024-05-12",
    time: "03:00 PM - 05:00 PM",
    attendees: 85,
    interested: 110,
    image: "/placeholder.svg?height=200&width=400",
    category: "academic",
    status: "upcoming",
  },
  {
    id: "5",
    title: "Orientation Welcome Party",
    description: "Welcome party for new students. Meet your peers and faculty members.",
    club: "Student Representative Council",
    location: "Student Center Main Hall",
    date: "2024-04-05",
    time: "06:00 PM - 10:00 PM",
    attendees: 250,
    interested: 320,
    image: "/placeholder.svg?height=200&width=400",
    category: "social",
    status: "past",
  },
  {
    id: "6",
    title: "Career Fair 2024",
    description: "Connect with potential employers and explore career opportunities.",
    club: "Career Development Office",
    location: "University Gymnasium",
    date: "2024-03-20",
    time: "09:00 AM - 03:00 PM",
    attendees: 380,
    interested: 450,
    image: "/placeholder.svg?height=200&width=400",
    category: "career",
    status: "past",
  },
]

export default function EventsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [interestedEvents, setInterestedEvents] = useState<string[]>([])

  // Filter events based on search query and active tab
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "upcoming") return matchesSearch && event.status === "upcoming"
    if (activeTab === "past") return matchesSearch && event.status === "past"
    if (activeTab === "interested") return matchesSearch && interestedEvents.includes(event.id)

    return matchesSearch && event.category === activeTab
  })

  const handleInterested = (eventId: string) => {
    if (interestedEvents.includes(eventId)) {
      setInterestedEvents(interestedEvents.filter((id) => id !== eventId))
      toast({
        title: "Removed from interested",
        description: "Event removed from your interested list",
      })
    } else {
      setInterestedEvents([...interestedEvents, eventId])
      toast({
        title: "Added to interested",
        description: "Event added to your interested list",
      })
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Discover and attend campus events</p>
        </div>
        <Link href="/dashboard/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
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

      <Tabs defaultValue="upcoming" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <Badge
                      variant="outline"
                      className={`${
                        event.status === "upcoming"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {event.status === "upcoming" ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 ${
                      interestedEvents.includes(event.id) ? "text-red-500" : ""
                    }`}
                    onClick={() => handleInterested(event.id)}
                  >
                    <Heart className={`h-4 w-4 ${interestedEvents.includes(event.id) ? "fill-current" : ""}`} />
                    <span className="sr-only">
                      {interestedEvents.includes(event.id) ? "Remove from interested" : "Add to interested"}
                    </span>
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{event.club}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <p className="text-sm line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3.5 w-3.5" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {event.status === "upcoming" ? "RSVP" : "View Details"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No events found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === "interested"
                    ? "You haven't marked any events as interested yet."
                    : "No events match your current search criteria."}
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

