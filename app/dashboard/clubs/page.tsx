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
import { Search, Users, Plus, Filter } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

interface Club {
  id: string
  name: string
  description: string
  members: number
  category: string
  type: string
  status: "active" | "pending"
  isUserMember?: boolean
}

// Main page component
export default function ClubsPage() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState<Club[]>([])
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-clubs")

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const res = await fetch("/api/auth/user/clubs", { credentials: "include" })
        const data = await res.json()
        setClubs(data.clubs || [])
      } catch (err) {
        console.error("Failed to fetch clubs:", err)
      }
    }
    const fetchAllClubs = async () => {
      try {
        const res = await fetch("/api/clubs", { credentials: "include" })
        const data = await res.json()
        setAllClubs(data || [])
      } catch (err) {
        console.error("Failed to fetch all clubs:", err)
      }
    }
    if (user) {
      fetchMyClubs()
      fetchAllClubs()
    }
  }, [user])

  const filtered = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clubs</h1>
          <p className="text-muted-foreground">View clubs you're a part of</p>
        </div>
        <Link href="/dashboard/clubs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </Link>
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
      <div className="flex justify-center my-4">
        <div className="flex bg-white rounded-full border shadow-sm overflow-hidden mx-auto">
          <button
            className={`px-4 py-2 focus:outline-none transition rounded-full text-center min-w-[110px] ${
              activeTab === "my-clubs"
                ? "bg-green-700 text-white"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("my-clubs")}
          >
            My Clubs
          </button>
          <button
            className={`px-4 py-2 focus:outline-none transition rounded-full text-center min-w-[110px] ${
              activeTab === "all"
                ? "bg-green-700 text-white"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Clubs
          </button>
        </div>
      </div>

      {activeTab === "my-clubs" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((club) => (
              <Card key={club._id || club.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{club.name}</CardTitle>
                    <Badge variant="outline">
                      {club.status === "pending" ? "Pending" : "Active"}
                    </Badge>
                  </div>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {club.members} members
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary">{club.category}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/clubs/${club._id || club.id}`}>
                      {club.status === "active" ? "View Details" : "Awaiting Approval"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No clubs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't joined any clubs yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {activeTab === "all" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allClubs.length > 0 ? (
            allClubs
              // Exclude clubs the user is already a member of
              .filter((club) =>
                !clubs.some((myClub) => (myClub._id || myClub.id) === (club._id || club.id)) &&
                (club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  club.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((club) => (
                <Card key={club._id || club.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{club.name}</CardTitle>
                      <Badge variant="outline">
                        {club.status === "pending" ? "Pending" : "Active"}
                      </Badge>
                    </div>
                    <CardDescription>{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {club.members} members
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary">{club.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/dashboard/clubs/${club._id || club.id}`}>
                        {club.status === "active" ? "View Details" : "Awaiting Approval"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No clubs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No clubs available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <MobileNav />
    </div>
  )
}
