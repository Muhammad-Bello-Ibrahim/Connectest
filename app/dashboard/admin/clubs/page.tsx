"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Copy } from "lucide-react"

export default function AdminClubsPage() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [createdClub, setCreatedClub] = useState<any>(null)

  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    email: "",
    password: "",
    type: "general",
    faculty: "",
    department: "",
    state: "",
    religion: "",
    description: "",
    logo: "",
  })

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/clubs", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch clubs")
      const data = await res.json()
      setClubs(Array.isArray(data) ? data : data.clubs || [])
    } catch (err: any) {
      setClubs([])
      toast({ 
        title: "Error", 
        description: err.message || "Failed to fetch clubs", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setForm(prev => ({ ...prev, password }))
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Club name is required", variant: "destructive" })
      return false
    }
    if (!form.abbreviation.trim()) {
      toast({ title: "Error", description: "Club abbreviation is required", variant: "destructive" })
      return false
    }
    if (!form.email.trim()) {
      toast({ title: "Error", description: "Club email is required", variant: "destructive" })
      return false
    }
    if (!form.password.trim()) {
      toast({ title: "Error", description: "Club password is required", variant: "destructive" })
      return false
    }
    if (!form.description.trim()) {
      toast({ title: "Error", description: "Club description is required", variant: "destructive" })
      return false
    }
    if (form.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" })
      return false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const clubData = {
        ...form,
        createdBy: user?._id,
        role: "club",
        status: "active"
      }

      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(clubData),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Error creating club")
      }

      // Show success message with credentials
      setCreatedClub({
        ...data.club,
        plainPassword: form.password // Store the plain password for display
      })
      
      // Refresh clubs list
      await fetchClubs()
      
      toast({ 
        title: "Club created successfully!", 
        description: "Club credentials have been generated. Make sure to save them."
      })

      // Reset form
      setForm({
        name: "",
        abbreviation: "",
        email: "",
        password: "",
        type: "general",
        faculty: "",
        department: "",
        state: "",
        religion: "",
        description: "",
        logo: "",
      })
      
    } catch (err: any) {
      console.error("Error creating club:", err)
      toast({ 
        title: "Error", 
        description: err.message || "Something went wrong", 
        variant: "destructive" 
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copied to clipboard!` })
    }).catch(() => {
      toast({ title: "Failed to copy", variant: "destructive" })
    })
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Manage Clubs</h1>
        <p className="text-muted-foreground">Create clubs with login credentials and manage existing clubs.</p>
      </div>

      {/* Club Creation Success Message */}
      {createdClub && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Club Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-700">
              <strong>{createdClub.name}</strong> has been created. Here are the login credentials:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-green-800">Email</Label>
                <div className="flex items-center gap-2">
                  <Input value={createdClub.email} readOnly className="bg-white" />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(createdClub.email, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Password</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={createdClub.plainPassword} 
                    readOnly 
                    className="bg-white"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(createdClub.plainPassword, "Password")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm text-green-800">
                <strong>Important:</strong> Save these credentials securely. The club can now login at{" "}
                <code className="bg-green-200 px-1 rounded">/login</code> using these credentials.
              </p>
            </div>
            <Button onClick={() => setCreatedClub(null)} variant="outline">
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Create New Club</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Club Name *</Label>
              <Input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="e.g., Nigeria Association of Computing Students"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Abbreviation *</Label>
              <Input 
                name="abbreviation" 
                value={form.abbreviation} 
                onChange={handleChange} 
                placeholder="e.g., NACOS"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Club Email *</Label>
              <Input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                placeholder="e.g., nacos@university.edu"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Password *</Label>
              <div className="flex items-center gap-2">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Enter secure password"
                  required 
                />
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline"
                  onClick={generatePassword}
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Club Type and Related Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Club Type *</Label>
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                className="w-full border rounded px-3 py-2 bg-background"
              >
                <option value="general">General</option>
                <option value="faculty">Faculty</option>
                <option value="department">Department</option>
                <option value="state">State</option>
                <option value="religion">Religion</option>
              </select>
            </div>

            {form.type === "faculty" && (
              <div className="space-y-2">
                <Label>Faculty</Label>
                <Input name="faculty" value={form.faculty} onChange={handleChange} />
              </div>
            )}

            {form.type === "department" && (
              <>
                <div className="space-y-2">
                  <Label>Faculty</Label>
                  <Input name="faculty" value={form.faculty} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input name="department" value={form.department} onChange={handleChange} />
                </div>
              </>
            )}

            {form.type === "state" && (
              <div className="space-y-2">
                <Label>State</Label>
                <Input name="state" value={form.state} onChange={handleChange} />
              </div>
            )}

            {form.type === "religion" && (
              <div className="space-y-2">
                <Label>Religion</Label>
                <Input name="religion" value={form.religion} onChange={handleChange} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Input 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Brief description of the club's purpose and activities"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Logo URL (optional)</Label>
            <Input 
              name="logo" 
              value={form.logo} 
              onChange={handleChange} 
              placeholder="https://example.com/logo.png"
            />
            {form.logo && (
              <img 
                src={form.logo} 
                alt="Logo Preview" 
                className="h-16 mt-2 rounded border object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Create Club with Login Credentials
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">All Clubs</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="religion">Religion</TabsTrigger>
        </TabsList>

        {["all", "general", "faculty", "department", "state", "religion"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              <div className="text-center py-6">Loading clubs...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs
                  .filter(club => tab === "all" || club.type === tab)
                  .map((club) => (
                    <Card key={club._id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{club.name}</CardTitle>
                          <Badge variant={club.status === 'active' ? 'default' : 'secondary'}>
                            {club.status || 'active'}
                          </Badge>
                        </div>
                        {club.abbreviation && (
                          <p className="text-sm text-muted-foreground">{club.abbreviation}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{club.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Type: {club.type}</span>
                          <span>Members: {club.members || 0}</span>
                        </div>
                        {club.email && (
                          <p className="text-xs text-muted-foreground">
                            Email: {club.email}
                          </p>
                        )}
                        {club.logo && (
                          <img
                            src={club.logo}
                            alt={`${club.name} Logo`}
                            className="h-12 w-12 rounded border bg-white object-contain"
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                ))}
              </div>
            )}
            
            {!loading && clubs.filter(club => tab === "all" || club.type === tab).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No clubs found in this category.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
