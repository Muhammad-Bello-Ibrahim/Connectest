"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { 
  Eye, EyeOff, Copy, Building2, Users, Calendar, TrendingUp, 
  Search, Filter, MoreVertical, Edit, Trash2, CheckCircle2, 
  XCircle, Plus, Download, Upload, RefreshCw, Mail, Shield
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminClubsPage() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [createdClub, setCreatedClub] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({
        ...prev,
        logo: 'Please upload an image file (JPEG, PNG, etc.)'
      }))
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        logo: 'Image size should be less than 2MB'
      }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
      setForm(prev => ({ ...prev, logo: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (form.name.length < 3) {
      errors.name = 'Name must be at least 3 characters'
    }
    
    if (form.abbreviation.length < 2) {
      errors.abbreviation = 'Abbreviation must be at least 2 characters'
    }
    
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (form.description.length < 10) {
      errors.description = 'Description must be at least 10 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      // Clear previous errors
      setFormErrors({});
      
      // Prepare the data to send
      const formData = {
        name: form.name.trim(),
        abbreviation: form.abbreviation.trim().toUpperCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        type: form.type,
        description: form.description.trim(),
        logo: form.logo || undefined,
        ...(form.faculty && { faculty: form.faculty }),
        ...(form.department && { department: form.department }),
        ...(form.state && { state: form.state }),
        ...(form.religion && { religion: form.religion }),
      };
      
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Accept': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle field-specific errors
        if (data.field) {
          setFormErrors(prev => ({
            ...prev,
            [data.field]: data.message || data.error
          }));
          
          // Scroll to the first error field
          const errorField = document.querySelector(`[name="${data.field}"]`);
          if (errorField) {
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorField.focus();
          }
          
          throw new Error(data.message || data.error);
        }
        
        // Handle multiple validation errors
        if (data.details && Array.isArray(data.details)) {
          const errors = data.details.reduce((acc: any, err: any) => ({
            ...acc,
            [err.field]: err.message
          }), {});
          
          setFormErrors(errors);
          
          // Scroll to the first error field if possible
          const firstErrorField = data.details[0]?.field;
          if (firstErrorField) {
            const fieldElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (fieldElement) {
              fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              fieldElement.focus();
            }
          }
          
          throw new Error(data.message || 'Please fix the form errors and try again.');
        }
        
        // Generic error
        throw new Error(data.message || data.error || 'Failed to create club');
      }
      
      setCreatedClub(data.club)
      setClubs(prev => [...prev, data.club])
      
      toast({ 
        title: "Success", 
        description: data.message || "Club created successfully!"
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
      setLogoPreview(null)
      setFormErrors({})
      setIsCreateDialogOpen(false)
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      })
    }
  }

  const handleDeleteClub = async (clubId: string) => {
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: "DELETE",
        credentials: "include",
      })
      
      if (!res.ok) throw new Error("Failed to delete club")
      
      setClubs(clubs.filter(club => club._id !== clubId))
      toast({ 
        title: "Success", 
        description: "Club deleted successfully" 
      })
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied!", description: "Copied to clipboard" })
  }

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = 
      club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.abbreviation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === "all" || club.type === selectedType
    
    return matchesSearch && matchesType
  })

  const stats = {
    total: clubs.length,
    general: clubs.filter(c => c.type === "general").length,
    faculty: clubs.filter(c => c.type === "faculty").length,
    department: clubs.filter(c => c.type === "department").length,
    state: clubs.filter(c => c.type === "state").length,
    religion: clubs.filter(c => c.type === "religion").length,
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "general":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20">General</Badge>
      case "faculty":
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20">Faculty</Badge>
      case "department":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20">Department</Badge>
      case "state":
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20">State</Badge>
      case "religion":
        return <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20">Religion</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Club Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage all clubs and societies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Club
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Club</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new club account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Club Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g., Google Developer Group"
                      className={formErrors.name ? 'border-destructive' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abbreviation">Abbreviation *</Label>
                    <Input
                      id="abbreviation"
                      name="abbreviation"
                      value={form.abbreviation}
                      onChange={handleChange}
                      placeholder="e.g., GDG"
                      className={formErrors.abbreviation ? 'border-destructive' : ''}
                    />
                    {formErrors.abbreviation && (
                      <p className="text-sm text-destructive">{formErrors.abbreviation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="club@example.com"
                      required
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        required
                        className={formErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      {formErrors.password && (
                        <p className="text-sm text-destructive mt-1">{formErrors.password}</p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Club Type *</Label>
                  <Select name="type" value={form.type} onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="faculty">Faculty-based</SelectItem>
                      <SelectItem value="department">Department-based</SelectItem>
                      <SelectItem value="state">State-based</SelectItem>
                      <SelectItem value="religion">Religion-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.type === "faculty" && (
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty</Label>
                    <Input
                      id="faculty"
                      name="faculty"
                      value={form.faculty}
                      onChange={handleChange}
                      placeholder="e.g., Science"
                    />
                  </div>
                )}

                {form.type === "department" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty</Label>
                      <Input
                        id="faculty"
                        name="faculty"
                        value={form.faculty}
                        onChange={handleChange}
                        placeholder="e.g., Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                )}

                {form.type === "state" && (
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="e.g., Gombe"
                    />
                  </div>
                )}

                {form.type === "religion" && (
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      name="religion"
                      value={form.religion}
                      onChange={handleChange}
                      placeholder="e.g., Islam"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief description of the club (min 10 characters)..."
                    rows={3}
                    className={formErrors.description ? 'border-destructive' : ''}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-destructive">{formErrors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 rounded-md border overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          <span className="text-xs text-center p-2">No logo selected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="logo"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-fit cursor-pointer"
                        >
                          {logoPreview ? "Change Logo" : "Upload Logo"}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, or WebP. Max 2MB.
                        </p>
                      </div>
                      {formErrors.logo && (
                        <p className="mt-2 text-sm text-destructive">
                          {formErrors.logo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setFormErrors({})
                      setLogoPreview(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Club
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.general}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.faculty}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.department}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.state}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Religion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.religion}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="religion">Religion</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={fetchClubs}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading clubs...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Criteria</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No clubs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClubs.map((club) => (
                        <TableRow key={club._id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                  {club.abbreviation || club.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{club.name}</div>
                                <div className="text-sm text-muted-foreground">{club.abbreviation}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(club.type)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {club.faculty && <div>Faculty: {club.faculty}</div>}
                              {club.department && <div>Dept: {club.department}</div>}
                              {club.state && <div>State: {club.state}</div>}
                              {club.religion && <div>Religion: {club.religion}</div>}
                              {!club.faculty && !club.department && !club.state && !club.religion && (
                                <span className="text-muted-foreground">All students</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{club.members?.length || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {club.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Club
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="h-4 w-4 mr-2" />
                                  View Members
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteClub(club._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Club
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredClubs.length} of {clubs.length} clubs
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Created Club Success Dialog */}
      {createdClub && (
        <Dialog open={!!createdClub} onOpenChange={() => setCreatedClub(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Club Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Save these credentials - they won't be shown again
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Club Name</Label>
                  <div className="font-medium">{createdClub.name}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{createdClub.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdClub.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Password</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-mono">{form.password}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(form.password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setCreatedClub(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
