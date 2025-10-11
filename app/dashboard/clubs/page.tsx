"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Users, 
  Plus, 
  Filter, 
  UserPlus,
  UserMinus,
  Loader2,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { MobileNav } from "@/components/mobile-nav"

interface Club {
  _id: string
  name: string
  description: string
  abbreviation?: string
  logo?: string
  type: string
  faculty?: string
  department?: string
  state?: string
  religion?: string
  members: number
  status: "active" | "pending"
  isUserMember?: boolean
}

export default function ClubsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [myClubs, setMyClubs] = useState<Club[]>([])
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"my-clubs" | "discover">("my-clubs")
  const [isLoading, setIsLoading] = useState(true)
  const [joiningClubs, setJoiningClubs] = useState<Set<string>>(new Set())

  // Fetch user's clubs
  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const res = await fetch("/api/auth/user/clubs", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setMyClubs(data.clubs || [])
        }
      } catch (err) {
        console.error("Failed to fetch my clubs:", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your clubs"
        })
      }
    }
    fetchMyClubs()
  }, [])

  // Fetch all clubs
  useEffect(() => {
    const fetchAllClubs = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (filterType !== "all") params.append("type", filterType)
        params.append("status", "active")
        
        const res = await fetch(`/api/clubs?${params}`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          // Mark clubs user is already member of
          const clubsWithMembership = (data.clubs || []).map((club: Club) => ({
            ...club,
            isUserMember: myClubs.some(myClub => myClub._id === club._id)
          }))
          setAllClubs(clubsWithMembership)
        }
      } catch (err) {
        console.error("Failed to fetch all clubs:", err)
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to load clubs"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllClubs()
  }, [filterType, myClubs])

  // Handle joining/leaving clubs
  const handleJoinLeave = async (club: Club) => {
    if (joiningClubs.has(club._id)) return

    setJoiningClubs(prev => new Set([...prev, club._id]))
    
    try {
      const method = club.isUserMember ? "DELETE" : "POST"
      const res = await fetch(`/api/clubs/${club._id}/join`, {
        method,
        credentials: "include"
      })

      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Success!",
          description: data.message
        })

        // Update club state
        if (club.isUserMember) {
          // User left club
          setMyClubs(prev => prev.filter(c => c._id !== club._id))
          setAllClubs(prev => prev.map(c => 
            c._id === club._id 
              ? { ...c, isUserMember: false, members: c.members - 1 }
              : c
          ))
        } else {
          // User joined club
          setMyClubs(prev => [...prev, club])
          setAllClubs(prev => prev.map(c => 
            c._id === club._id 
              ? { ...c, isUserMember: true, members: c.members + 1 }
              : c
          ))
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Operation failed"
        })
      }
    } catch (err) {
      console.error("Failed to join/leave club:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error. Please try again."
      })
    } finally {
      setJoiningClubs(prev => {
        const newSet = new Set(prev)
        newSet.delete(club._id)
        return newSet
      })
    }
  }

  // Filter clubs based on search query
  const getFilteredClubs = (clubs: Club[]) => {
    return clubs.filter(club =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.faculty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.department?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredMyClubs = getFilteredClubs(myClubs)
  const filteredAllClubs = getFilteredClubs(allClubs)

  return (
    <div className="min-h-screen pb-20 md:pb-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Discover Communities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 md:mb-3">Student Clubs</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl">
            Join vibrant communities, make lasting connections, and explore your passions
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
            className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-11 text-sm sm:text-base">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="state">State</SelectItem>
            <SelectItem value="religion">Religion</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-6">
        <div className="inline-flex items-center rounded-lg bg-muted p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("my-clubs")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "my-clubs"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">My Clubs ({myClubs.length})</span>
            <span className="sm:hidden">My Clubs</span>
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "discover"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "my-clubs" ? (
        <div>
          {filteredMyClubs.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {filteredMyClubs.map((club) => (
                <div 
                  key={club._id} 
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer hover:shadow-md"
                  onClick={() => router.push(`/dashboard/clubs/${club._id}`)}
                >
                  {/* Club Logo */}
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
                    {club.logo ? (
                      <img 
                        src={club.logo} 
                        alt={club.name}
                        className="w-full h-full rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                        <span className="text-lg sm:text-xl font-bold text-primary">
                          {club.abbreviation?.[0] || club.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Club Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                      {club.name}
                    </h3>
                    {club.abbreviation && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {club.abbreviation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No clubs yet</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No clubs match your search"
                    : "Start exploring and join your first club!"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setActiveTab("discover")} size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Discover Clubs
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 rounded-lg border bg-card">
                  <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredAllClubs.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {filteredAllClubs.map((club) => {
                // Check if club is auto-joined (cannot be left)
                const isAutoJoined = ['src', 'faculty', 'department', 'state', 'religion'].includes(club.type)
                
                return (
                  <div 
                    key={club._id} 
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer hover:shadow-md"
                    onClick={() => router.push(`/dashboard/clubs/${club._id}`)}
                  >
                    {/* Club Logo */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
                      {club.logo ? (
                        <img 
                          src={club.logo} 
                          alt={club.name}
                          className="w-full h-full rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                          <span className="text-lg sm:text-xl font-bold text-primary">
                            {club.abbreviation?.[0] || club.name[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Club Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                        {club.name}
                      </h3>
                      {club.abbreviation && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {club.abbreviation}
                        </p>
                      )}
                    </div>

                    {/* Auto-joined badge for mandatory clubs */}
                    {isAutoJoined && club.isUserMember && (
                      <Badge variant="secondary" className="flex-shrink-0 text-xs">
                        Auto-joined
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "No clubs available at the moment"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
