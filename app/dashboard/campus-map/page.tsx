"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Navigation, Building, Info } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

// Mock data for campus locations
const mockCampusLocations = [
  {
    id: "1",
    name: "Science Complex",
    type: "Academic Building",
    description: "Houses the departments of Computer Science, Physics, and Chemistry",
    floors: 4,
    facilities: ["Lecture Halls", "Laboratories", "Faculty Offices"],
    coordinates: { lat: 9.0765, lng: 7.3986 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "University Library",
    type: "Library",
    description: "Main library with study spaces and extensive collection of books",
    floors: 3,
    facilities: ["Reading Rooms", "Computer Lab", "Group Study Rooms"],
    coordinates: { lat: 9.0768, lng: 7.399 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Student Center",
    type: "Administrative",
    description: "Central hub for student services and activities",
    floors: 2,
    facilities: ["Cafeteria", "Student Affairs Office", "Club Meeting Rooms"],
    coordinates: { lat: 9.077, lng: 7.3995 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "Engineering Building",
    type: "Academic Building",
    description: "Home to all engineering departments and labs",
    floors: 5,
    facilities: ["Workshops", "Design Studios", "Research Labs"],
    coordinates: { lat: 9.0775, lng: 7.398 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "Sports Complex",
    type: "Recreational",
    description: "Sports facilities including stadium, courts, and gym",
    floors: 2,
    facilities: ["Stadium", "Basketball Courts", "Gym", "Swimming Pool"],
    coordinates: { lat: 9.078, lng: 7.4 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "Medical Center",
    type: "Healthcare",
    description: "Campus medical facility providing healthcare services",
    floors: 3,
    facilities: ["Emergency Room", "Pharmacy", "Consultation Rooms"],
    coordinates: { lat: 9.076, lng: 7.3975 },
    image: "/placeholder.svg?height=200&width=300",
  },
]

const mapContainerStyle = { width: "100%", height: "350px", borderRadius: "0.5rem" }
const center = { lat: 9.0768, lng: 7.3986 }

export default function CampusMapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  // Filter locations based on search query
  const filteredLocations = mockCampusLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedLocationData = selectedLocation ? mockCampusLocations.find((loc) => loc.id === selectedLocation) : null

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedLocation(id)
  }, [])

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="sticky top-14 z-10 -mx-4 bg-background/95 backdrop-blur px-4 py-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campus locations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Campus Map</CardTitle>
              <CardDescription>Find your way around campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full bg-muted rounded-md overflow-hidden" style={{ minHeight: 350 }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={17}
                  >
                    {mockCampusLocations.map((location) => (
                      <Marker
                        key={location.id}
                        position={location.coordinates}
                        onClick={() => handleMarkerClick(location.id)}
                        icon={selectedLocation === location.id ? undefined : undefined}
                      />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center h-full">Loading map...</div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm">
                  <Navigation className="mr-2 h-4 w-4" />
                  My Location
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="mr-2 h-4 w-4" />
                  Legend
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedLocationData && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedLocationData.name}</CardTitle>
                  <Badge variant="outline">
                    <Building className="mr-1 h-3 w-3" />
                    {selectedLocationData.type}
                  </Badge>
                </div>
                <CardDescription>{selectedLocationData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={selectedLocationData.image || "/placeholder.svg"}
                  alt={selectedLocationData.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Floors:</span>
                    <span>{selectedLocationData.floors}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Facilities:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedLocationData.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Campus Buildings</CardTitle>
              <CardDescription>Browse all campus locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredLocations.map((location) => (
                  <Card
                    key={location.id}
                    className={`overflow-hidden cursor-pointer transition-colors ${
                      selectedLocation === location.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <div className="flex">
                      <img
                        src={location.image || "/placeholder.svg"}
                        alt={location.name}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{location.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {location.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{location.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No locations found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search query.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}

