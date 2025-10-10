"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
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
  MapPin, 
  Calendar,
  Star,
  UserPlus,
  UserMinus,
  Loader2
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"

interface Club {
  _id: string
  name: string
  description: string
  abbreviation?: string
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
  const [myClubs, setMyClubs] = useState<Club[]>([])
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("my-clubs")
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

  const ClubCard = ({ club, showJoinButton = false }: { club: Club, showJoinButton?: boolean }) => (
    <Card key={club._id} className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${club.type === 'src' ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
              <span className="truncate">{club.name}</span>
              {club.type === 'src' && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 text-xs font-semibold">SRC</span>
              )}
              {club.type === 'general' && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-xs font-semibold">General</span>
              )}
            </CardTitle>
            {club.abbreviation && (
              <p className="text-sm text-muted-foreground truncate">({club.abbreviation})</p>
            )}
          </div>
          <Badge variant={club.status === "active" ? "default" : "secondary"} className="flex-shrink-0">
            {club.status === "pending" ? "Pending" : "Active"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">{club.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          {club.members} members
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {club.type}
          </Badge>
          {club.faculty && (
            <Badge variant="outline" className="text-xs">
              {club.faculty}
            </Badge>
          )}
          {club.department && (
            <Badge variant="outline" className="text-xs">
              {club.department}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 space-x-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/dashboard/clubs/${club._id}`}>
            View Details
          </Link>
        </Button>
        {/* Prevent leaving SRC club */}
        {showJoinButton && club.status === "active" && club.type !== 'src' && (
          <Button
            variant={club.isUserMember ? "destructive" : "default"}
            size="sm"
            onClick={() => handleJoinLeave(club)}
            disabled={joiningClubs.has(club._id)}
            className="min-w-[100px]"
          >
            {joiningClubs.has(club._id) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : club.isUserMember ? (
              <>
                <UserMinus className="mr-1 h-4 w-4" />
                Leave
              </>
            ) : (
              <>
                <UserPlus className="mr-1 h-4 w-4" />
                Join
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">
            Discover and join clubs that match your interests
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clubs/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Club
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
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
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "my-clubs"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("my-clubs")}
          >
            My Clubs ({myClubs.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("all")}
          >
            Discover Clubs
          </button>
        </div>
      </div>
      {/* Info note about SRC and General clubs */}
      <div className="text-center text-xs text-muted-foreground mt-2">
        <span>All students are automatically members of the <b>SRC</b> club and cannot leave it. "General" clubs are opt-in and can be joined or left at any time.</span>
      </div>

      {/* Content */}
      {activeTab === "my-clubs" ? (
        <div className="space-y-4">
          {filteredMyClubs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMyClubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No clubs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "No clubs match your search criteria" 
                    : "You haven't joined any clubs yet"
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setActiveTab("all")}>
                    Discover Clubs
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAllClubs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAllClubs.map((club) => (
                <ClubCard key={club._id} club={club} showJoinButton />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No clubs found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "No clubs match your search criteria"
                    : "No active clubs available"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
