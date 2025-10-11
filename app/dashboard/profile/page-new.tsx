"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X,
  Users, MessageSquare, Heart, Award, Building2, BookOpen
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [myClubs, setMyClubs] = useState<any[]>([])
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
  })
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    gender: "",
    dob: "",
    state: "",
    localGovt: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        gender: user.gender || "",
        dob: user.dob || "",
        state: user.state || "",
        localGovt: user.localGovt || "",
      })
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user's clubs
      const clubsRes = await fetch("/api/auth/user/clubs", { credentials: "include" })
      if (clubsRes.ok) {
        const clubsData = await clubsRes.json()
        setMyClubs(clubsData.clubs || [])
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await updateProfile(formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        gender: user.gender || "",
        dob: user.dob || "",
        state: user.state || "",
        localGovt: user.localGovt || "",
      })
    }
    setIsEditing(false)
  }

  // Calculate profile completion
  const requiredFields = ['phone', 'gender', 'address', 'state', 'localGovt', 'dob', 'bio']
  const filledFields = requiredFields.filter(field => user?.[field])
  const profileCompletion = Math.round((filledFields.length / requiredFields.length) * 100)

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">User not found</h2>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary via-primary/90 to-purple-600"></div>
          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-4xl">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="gap-1">
                    <User className="h-3 w-3" />
                    {user.role}
                  </Badge>
                  {user.faculty && (
                    <Badge variant="secondary" className="gap-1">
                      <Building2 className="h-3 w-3" />
                      {user.faculty}
                    </Badge>
                  )}
                  {user.department && (
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      {user.department}
                    </Badge>
                  )}
                </div>

                {/* Profile Completion */}
                {profileCompletion < 100 && (
                  <div className="max-w-md mx-auto md:mx-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete your profile to unlock all features
                    </p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel} variant="outline" className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                      <Save className="h-4 w-4" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myClubs.length}</div>
              <Link href="/dashboard/clubs" className="text-xs text-primary hover:underline">
                View all clubs
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.posts}</div>
              <p className="text-xs text-muted-foreground">Total posts created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Likes Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.likes}</div>
              <p className="text-xs text-muted-foreground">On your posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.comments}</div>
              <p className="text-xs text-muted-foreground">Total comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="clubs">Clubs ({myClubs.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your personal details" : "Your personal details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter gender"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        State
                      </Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter state"
                      />
                    </div>

                    {/* Local Government */}
                    <div className="space-y-2">
                      <Label htmlFor="localGovt">Local Government</Label>
                      <Input
                        id="localGovt"
                        value={formData.localGovt}
                        onChange={(e) => setFormData({ ...formData, localGovt: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter local government"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                      />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your academic details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Faculty</Label>
                    <p className="font-medium">{user.faculty || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">{user.department || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Matric Number</Label>
                    <p className="font-medium">{user.matricNumber || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Level</Label>
                    <p className="font-medium">{user.level || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Tab */}
          <TabsContent value="clubs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Clubs</CardTitle>
                <CardDescription>Clubs you're a member of</CardDescription>
              </CardHeader>
              <CardContent>
                {myClubs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {myClubs.map((club) => (
                      <Link key={club._id} href={`/dashboard/clubs/${club._id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {club.abbreviation || club.name?.[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{club.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {club.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {club.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {club.members || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No clubs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Join clubs to connect with others
                    </p>
                    <Link href="/dashboard/clubs">
                      <Button>Explore Clubs</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
