"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Member {
  _id: string
  name: string
  email: string
  studentId?: string
  faculty?: string
  department?: string
  state?: string
  level?: string
  avatar?: string
  joinedAt: string
}

export default function ClubMembersPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      // This would be the API call to get club members
      // For now, using mock data
      const mockMembers: Member[] = [
        {
          _id: "1",
          name: "Ahmed Ibrahim",
          email: "ahmed.ibrahim@student.edu",
          studentId: "UG20/SCCS/1001",
          faculty: "SCIENCE",
          department: "COMPUTER SCIENCE",
          state: "GOMBE",
          level: "400L",
          joinedAt: "2024-01-15"
        },
        {
          _id: "2",
          name: "Fatima Abubakar",
          email: "fatima.abubakar@student.edu",
          studentId: "UG21/SCCS/1045",
          faculty: "SCIENCE",
          department: "COMPUTER SCIENCE",
          state: "KANO",
          level: "300L",
          joinedAt: "2024-02-20"
        },
        {
          _id: "3",
          name: "Muhammad Bello",
          email: "muhammad.bello@student.edu",
          studentId: "UG22/SCCS/1078",
          faculty: "SCIENCE",
          department: "COMPUTER SCIENCE",
          state: "BAUCHI",
          level: "200L",
          joinedAt: "2024-03-10"
        }
      ]
      setMembers(mockMembers)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load members"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Members</h1>
          <p className="text-muted-foreground">
            Manage and view your club's {members.length} members
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchMembers} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Faculty</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Science</div>
            <p className="text-xs text-muted-foreground">Computer Science</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Weekly activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                      {member.studentId && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>ID: {member.studentId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {member.level && (
                        <Badge variant="secondary">{member.level}</Badge>
                      )}
                      {member.state && (
                        <Badge variant="outline">{member.state}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {member.faculty && member.department && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{member.faculty}</span>
                      </div>
                      <span>•</span>
                      <span>{member.department}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No members match your search criteria" 
                : "No members have joined this club yet"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}