"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MobileNav } from "@/components/mobile-nav"
import { 
  Pencil, 
  X,
  Check,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Building, 
  Calendar, 
  Home, 
  Bell, 
  Users,
  Camera,
  Lock,
  BookOpen,
  GraduationCap,
  Award
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [editedData, setEditedData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    address: (user as any)?.address || "",
    bio: (user as any)?.bio || ""
  })

  const handleSavePersonal = async () => {
    try {
      const res = await fetch("/api/auth/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          address: editedData.address
        }),
      })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully"
        })
        setIsEditingPersonal(false)
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      })
    }
  }

  const handleSaveBio = async () => {
    try {
      const res = await fetch("/api/auth/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bio: editedData.bio }),
      })
      
      if (res.ok) {
        toast({
          title: "Success",
          description: "Bio updated successfully"
        })
        setIsEditingBio(false)
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bio"
      })
    }
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-medium">User not found</h2>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const userClubs = (user as any)?.clubs || []
  const userAvatar = (user as any)?.avatar
  const userBio = (user as any)?.bio
  const userPhone = (user as any)?.phone
  const userAddress = (user as any)?.address
  const userState = (user as any)?.state
  const userLocalGovt = (user as any)?.localGovt
  const userGender = (user as any)?.gender
  const userDob = (user as any)?.dob
  const userStudentId = (user as any)?.studentId
  const userLevel = (user as any)?.level
  const userFaculty = (user as any)?.faculty
  const userDepartment = (user as any)?.department

  return (
    <>
    <div className="space-y-6 pb-20 md:pb-6 max-w-5xl mx-auto">
      {/* Header with Cover Photo */}
      <div className="relative">
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg" />
        <div className="absolute -bottom-16 left-6 md:left-8">
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background">
              <AvatarImage src={userAvatar} alt={user.name} />
              <AvatarFallback className="text-3xl font-bold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Name and Role */}
      <div className="pt-16 px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
              {userStudentId && (
                <span className="text-sm text-muted-foreground">
                  ID: {userStudentId}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsEditingPersonal(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Bio Section */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">About</CardTitle>
            {!isEditingBio && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditingBio(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditingBio ? (
              <div className="space-y-3">
                <Textarea
                  value={editedData.bio}
                  onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveBio}>
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setEditedData({...editedData, bio: userBio || ""})
                      setIsEditingBio(false)
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {userBio || "No bio provided yet. Click edit to add one."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clubs Section */}
        {userClubs.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clubs & Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userClubs.map((club: any) => (
                  <Link 
                    key={club._id || club}
                    href={`/dashboard/clubs/${club._id}`}
                    className="group"
                  >
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {club.name || club.abbreviation || club}
                      {club.type === 'src' && (
                        <Award className="ml-1 h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </Badge>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <Award className="inline h-3 w-3 mr-1" />
                SRC members have special privileges
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>

                {userPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{userPhone}</p>
                    </div>
                  </div>
                )}

                {userAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{userAddress}</p>
                    </div>
                  </div>
                )}

                {userState && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">State / LGA</p>
                      <p className="text-sm font-medium">{userState} / {userLocalGovt}</p>
                    </div>
                  </div>
                )}

                {userGender && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-medium capitalize">{userGender}</p>
                    </div>
                  </div>
                )}

                {userDob && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm font-medium">
                        {new Date(userDob).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          {user.role === "student" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {userStudentId && (
                    <div className="flex items-start gap-3">
                      <School className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Student ID</p>
                        <p className="text-sm font-medium font-mono">{userStudentId}</p>
                      </div>
                    </div>
                  )}

                  {userLevel && (
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Level</p>
                        <p className="text-sm font-medium">{userLevel}</p>
                      </div>
                    </div>
                  )}

                  {userFaculty && (
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Faculty</p>
                        <p className="text-sm font-medium">{userFaculty}</p>
                      </div>
                    </div>
                  )}

                  {userDepartment && (
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium">{userDepartment}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Award className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Academic Standing</p>
                      <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                        Good Standing
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Update Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Personal Info Dialog */}
      {isEditingPersonal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Personal Information</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingPersonal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={editedData.name}
                  onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={editedData.phone}
                  onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Textarea
                  value={editedData.address}
                  onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                  placeholder="Enter your address"
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSavePersonal} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingPersonal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>

    {/* Mobile Bottom Navigation */}
    <MobileNav />
    </>
  )
}
