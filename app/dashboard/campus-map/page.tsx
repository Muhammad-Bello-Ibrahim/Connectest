"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Navigation, Building, Info } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api"

// Updated mock data for Gombe State University (GSU) locations
const mockCampusLocations = [
  {
    id: "1",
    name: "Main Campus",
    type: "Administrative",
    description: "Primary campus housing the VC's office, registry, and main lecture halls",
    floors: 3,
    facilities: ["Lecture Halls", "Admin Offices", "ICT Center"],
    coordinates: { lat: 10.2904, lng: 11.1719 }, // Exact GSU coordinates
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "GSU Library",
    type: "Library",
    description: "Central library with over 50,000 academic resources",
    floors: 2,
    facilities: ["Reading Rooms", "E-Library", "Research Section"],
    coordinates: { lat: 10.2910, lng: 11.1725 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Science Complex",
    type: "Academic Building",
    description: "Faculties of Science, Agriculture, and Computing",
    floors: 4,
    facilities: ["Labs", "Lecture Theaters", "Faculty Offices"],
    coordinates: { lat: 10.2900, lng: 11.1705 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "Student Hostels",
    type: "Residential",
    description: "On-campus accommodation for students",
    floors: 2,
    facilities: ["Common Rooms", "Laundry", "24/7 Security"],
    coordinates: { lat: 10.2895, lng: 11.1730 },
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "Health Center",
    type: "Medical",
    description: "University clinic providing basic healthcare services",
    floors: 1,
    facilities: ["Pharmacy", "Consultation Rooms", "Emergency Care"],
    coordinates: { lat: 10.2915, lng: 11.1710 },
    image: "/placeholder.svg?height=200&width=300",
  },
]

const mapContainerStyle = { width: "100%", height: "350px", borderRadius: "0.5rem" }
const center = { lat: 10.2904, lng: 11.1719 } // GSU's central coordinates

export default function CampusMapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const filteredLocations = mockCampusLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedLocationData = selectedLocation 
    ? mockCampusLocations.find((loc) => loc.id === selectedLocation) 
    : null

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedLocation(id)
    setActiveMarker(id)
  }, [])

  const handleCloseInfoWindow = useCallback(() => {
    setActiveMarker(null)
  }, [])

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="sticky top-14 z-10 -mx-4 bg-background/95 backdrop-blur px-4 py-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search GSU locations..."
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
              <CardTitle>Gombe State University Map</CardTitle>
              <CardDescription>Navigate the campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full bg-muted rounded-md overflow-hidden" style={{ minHeight: 350 }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={16}
                  >
                    {mockCampusLocations.map((location) => (
                      <>
                        <Marker
                          key={location.id}
                          position={location.coordinates}
                          onClick={() => handleMarkerClick(location.id)}
                          icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            scaledSize: new window.google.maps.Size(32, 32),
                          }}
                        />
                        {activeMarker === location.id && (
                          <InfoWindow
                            position={location.coordinates}
                            onCloseClick={handleCloseInfoWindow}
                          >
                            <div className="text-sm">
                              <h3 className="font-bold">{location.name}</h3>
                              <p>{location.type}</p>
                            </div>
                          </InfoWindow>
                        )}
                      </>
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
                <Button 
                  className="w-full mt-4"
                  onClick={() => window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedLocationData.coordinates.lat},${selectedLocationData.coordinates.lng}`
                  )}
                >
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
              <CardDescription>All GSU locations</CardDescription>
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
                    <p className="mt-2 text-sm text-muted-foreground">Try a different search term.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}