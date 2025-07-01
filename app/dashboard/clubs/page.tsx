"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-clubs")

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/user/clubs", { credentials: "include" })
        const data = await res.json()
        setClubs(data.clubs || [])
      } catch (err) {
        console.error("Failed to fetch clubs:", err)
      }
    }

    if (user) fetchClubs()
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

      <Tabs defaultValue="my-clubs" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered
              .filter((club) => {
                if (activeTab === "pending") return club.status === "pending"
                return true
              })
              .map((club) => (
                <Card key={club.id}>
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
                      <Link href={`/dashboard/clubs/${club.id}`}>
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
                  {activeTab === "pending"
                    ? "You have no clubs awaiting approval."
                    : "You haven't joined any clubs yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <MobileNav />
    </div>
  )
}
