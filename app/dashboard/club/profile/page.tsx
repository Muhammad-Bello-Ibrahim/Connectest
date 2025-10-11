"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Edit, Save, Upload, MapPin, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ClubProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Mock club data - this would come from API
  const [clubData, setClubData] = useState({
    name: "Nigeria Association of Computing Students (NACOS)",
    abbreviation: "NACOS",
    description: "NACOS is the premier association for computing students in Nigeria, dedicated to advancing knowledge in computer science and related fields.",
    logo: "",
    type: "academic",
    faculty: "SCIENCE",
    department: "COMPUTER SCIENCE",
    state: "",
    religion: "",
    members: 127,
    status: "active",
    founded: "2018-09-15",
    contact: {
      email: "nacos.gombe@university.edu",
      phone: "+234 806 123 4567",
      website: "https://nacos-gombe.com"
    },
    socialMedia: {
      twitter: "@nacosGombe",
      instagram: "@nacos_gombe",
      linkedin: "nacos-gombe-state-university"
    }
  })

  const [formData, setFormData] = useState(clubData)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // API call to update club profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setClubData(formData)
      setIsEditing(false)
      
      toast({
        title: "Profile Updated",
        description: "Your club profile has been successfully updated."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(clubData)
    setIsEditing(false)
  }

  const clubTypes = [
    { value: "academic", label: "Academic" },
    { value: "social", label: "Social" },
    { value: "religious", label: "Religious" },
    { value: "state", label: "State-based" },
    { value: "sports", label: "Sports" },
    { value: "cultural", label: "Cultural" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Club Profile</h1>
          <p className="text-muted-foreground">
            Manage your club's public information and settings
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core details about your club that members and students will see
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.logo} />
                <AvatarFallback className="text-lg">
                  {formData.abbreviation || formData.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Club Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation</Label>
                <Input
                  id="abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({...formData, abbreviation: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="type">Club Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clubTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How members and interested students can reach your club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData({
                  ...formData, 
                  contact: {...formData.contact, email: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => setFormData({
                  ...formData, 
                  contact: {...formData.contact, phone: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.contact.website}
                onChange={(e) => setFormData({
                  ...formData, 
                  contact: {...formData.contact, website: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Connect your club's social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                placeholder="@username"
                value={formData.socialMedia.twitter}
                onChange={(e) => setFormData({
                  ...formData, 
                  socialMedia: {...formData.socialMedia, twitter: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="@username"
                value={formData.socialMedia.instagram}
                onChange={(e) => setFormData({
                  ...formData, 
                  socialMedia: {...formData.socialMedia, instagram: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="company-name"
                value={formData.socialMedia.linkedin}
                onChange={(e) => setFormData({
                  ...formData, 
                  socialMedia: {...formData.socialMedia, linkedin: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Club Statistics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Club Statistics</CardTitle>
            <CardDescription>
              Key metrics and information about your club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{clubData.members}</p>
                  <p className="text-xs text-muted-foreground">Total Members</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Date().getFullYear() - new Date(clubData.founded).getFullYear()}
                  </p>
                  <p className="text-xs text-muted-foreground">Years Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{clubData.faculty}</p>
                  <p className="text-xs text-muted-foreground">Faculty</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={clubData.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {clubData.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
