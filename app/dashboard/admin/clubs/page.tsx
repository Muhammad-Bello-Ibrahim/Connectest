"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

export default function AdminClubsPage() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    type: "general",
    faculty: "",
    department: "",
    state: "",
    religion: "",
    description: "",
    logo: "",
  })

  useEffect(() => {
    fetch("/api/auth/clubs")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch clubs")
        return res.json()
      })
      .then(data => setClubs(Array.isArray(data) ? data : data.clubs || []))
      .catch(err => {
        setClubs([])
        toast({ title: "Error", description: err.message || "Failed to fetch clubs", variant: "destructive" })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/auth/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error creating club")
      setClubs(prev => [...prev, data])
      toast({ title: "Club created!" })
      setForm({
        name: "",
        abbreviation: "",
        type: "general",
        faculty: "",
        department: "",
        state: "",
        religion: "",
        description: "",
        logo: "",
      })
    } catch (err: any) {
      console.error("Error:", err)
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Manage Clubs</h1>
        <p className="text-muted-foreground">Create or manage all clubs in the system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Club</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Abbreviation</Label>
            <Input name="abbreviation" value={form.abbreviation} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-2 py-1">
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

          <div className="col-span-2 space-y-2">
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Logo URL</Label>
            <Input name="logo" value={form.logo} onChange={handleChange} />
            {form.logo && (
              <img src={form.logo} alt="Logo Preview" className="h-16 mt-2 rounded border" />
            )}
          </div>

          <div className="col-span-2">
            <Button onClick={handleSubmit}>Create Club</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="religion">Religion</TabsTrigger>
        </TabsList>

        {["all", "general", "faculty", "department", "state", "religion"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs
                .filter(club => tab === "all" || club.type === tab)
                .map((club) => (
                  <Card key={club._id}>
                    <CardHeader>
                      <CardTitle>{club.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{club.description}</p>
                      <p className="text-sm text-muted-foreground">{club.type}</p>
                      {club.logo ? (
                        <img
                          src={club.logo}
                          alt={club.name ? `${club.name} Logo` : "Logo"}
                          className="h-10 mt-2 rounded border bg-white object-contain"
                          style={{ maxWidth: 80 }}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder-logo.png";
                          }}
                        />
                      ) : (
                        <img
                          src="/placeholder-logo.png"
                          alt="No Logo"
                          className="h-10 mt-2 rounded border bg-white object-contain"
                          style={{ maxWidth: 80 }}
                        />
                      )}
                    </CardContent>
                  </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
