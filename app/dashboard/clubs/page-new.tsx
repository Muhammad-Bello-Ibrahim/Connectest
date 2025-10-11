"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, Users, Plus, Filter, MapPin, Building2,
  UserPlus, UserMinus, Loader2, Sparkles, TrendingUp
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  logo?: string
}

export default function ClubsPage() {
  const { user } = useAuth()
  const [myClubs, setMyClubs] = useState<Club[]>([])
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("discover")
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
        if (searchQuery) params.append("search", searchQuery)
        params.append("status", "active")
        
        const res = await fetch(`/api/clubs?${params}`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
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
  }, [filterType, searchQuery, myClubs])

  // Join/Leave club
  const handleJoinLeave = async (clubId: string, isJoining: boolean) => {
    if (joiningClubs.has(clubId)) return

    setJoiningClubs(prev => new Set([...prev, clubId]))

    try {
      const res = await fetch(`/api/clubs/${clubId}/${isJoining ? 'join' : 'leave'}`, {
        method: 'POST',
        credentials: 'include'
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: isJoining ? "You've joined the club!" : "You've left the club"
        })
        
        // Update local state
        if (isJoining) {
          const club = allClubs.find(c => c._id === clubId)
          if (club) setMyClubs(prev => [...prev, club])
        } else {
          setMyClubs(prev => prev.filter(c => c._id !== clubId))
        }
        
        // Update all clubs list
        setAllClubs(prev => prev.map(club => 
          club._id === clubId 
            ? { ...club, isUserMember: isJoining, members: club.members + (isJoining ? 1 : -1) }
            : club
        ))
      } else {
        const data = await res.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update membership"
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error"
      })
    } finally {
      setJoiningClubs(prev => {
        const newSet = new Set(prev)
        newSet.delete(clubId)
        return newSet
      })
    }
  }

  const ClubCard = ({ club }: { club: Club }) => (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Club Logo/Avatar */}
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={club.logo} alt={club.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-xl font-bold">
              {club.abbreviation || club.name?.[0]}
            </AvatarFallback>
          </Avatar>

          {/* Club Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{club.name}</h3>
                {club.abbreviation && (
                  <p className="text-sm text-muted-foreground">{club.abbreviation}</p>
                )}
              </div>
              {club.isUserMember && (
                <Badge variant="secondary" className="flex-shrink-0">Member</Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {club.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                {club.type}
              </Badge>
              {club.faculty && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Building2 className="h-3 w-3" />
                  {club.faculty}
                </Badge>
              )}
              {club.state && (
                <Badge variant="outline" className="text-xs gap-1">
                  <MapPin className="h-3 w-3" />
                  {club.state}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                {club.members || 0} members
              </span>

              <div className="flex gap-2">
                <Link href={`/dashboard/clubs/${club._id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                
                {club.isUserMember ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleJoinLeave(club._id, false)}
                    disabled={joiningClubs.has(club._id)}
                    className="gap-1"
                  >
                    {joiningClubs.has(club._id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserMinus className="h-4 w-4" />
                    )}
                    Leave
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleJoinLeave(club._id, true)}
                    disabled={joiningClubs.has(club._id)}
                    className="gap-1"
                  >
                    {joiningClubs.has(club._id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Join
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Clubs
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and join clubs that match your interests
            </p>
          </div>
          
          <Link href="/dashboard/clubs/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Club
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myClubs.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{allClubs.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available to Join
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {allClubs.filter(c => !c.isUserMember).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-clubs">My Clubs ({myClubs.length})</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clubs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="religion">Religion</SelectItem>
                      <SelectItem value="src">SRC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Clubs Grid */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-16 bg-muted rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : allClubs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allClubs.map((club) => (
                  <ClubCard key={club._id} club={club} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clubs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={() => { setSearchQuery(""); setFilterType("all") }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Clubs Tab */}
          <TabsContent value="my-clubs" className="space-y-6">
            {myClubs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myClubs.map((club) => (
                  <ClubCard key={club._id} club={club} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No clubs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Join clubs to connect with others who share your interests
                  </p>
                  <Button onClick={() => setActiveTab("discover")}>
                    Discover Clubs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
