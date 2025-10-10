"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, Plus, Send, Eye, Edit, Trash2, BarChart3, Clock, CheckCircle2
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function CampaignsPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  
  const [form, setForm] = useState({
    name: "",
    subject: "",
    content: "",
    recipientType: "all",
    role: "",
    faculty: "",
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/campaigns")
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const recipients: any = {
        type: form.recipientType,
        filters: {},
      }

      if (form.recipientType !== "all") {
        if (form.role) recipients.filters.role = form.role
        if (form.faculty) recipients.filters.faculty = form.faculty
      }

      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          subject: form.subject,
          content: form.content,
          recipients,
          createdBy: "admin-user-id", // TODO: Get from session
        }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Campaign created successfully",
        })
        setShowCreateDialog(false)
        setForm({
          name: "",
          subject: "",
          content: "",
          recipientType: "all",
          role: "",
          faculty: "",
        })
        fetchCampaigns()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      })
    }
  }

  const handleSend = async (campaignId: string) => {
    if (!confirm("Are you sure you want to send this campaign?")) return

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/send`, {
        method: "POST",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Campaign sent successfully",
        })
        fetchCampaigns()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: any = {
      draft: "bg-gray-100 text-gray-700",
      scheduled: "bg-blue-100 text-blue-700",
      sending: "bg-orange-100 text-orange-700",
      sent: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    }

    const icons: any = {
      draft: <Edit className="h-3 w-3 mr-1" />,
      scheduled: <Clock className="h-3 w-3 mr-1" />,
      sending: <Send className="h-3 w-3 mr-1" />,
      sent: <CheckCircle2 className="h-3 w-3 mr-1" />,
      failed: <Trash2 className="h-3 w-3 mr-1" />,
    }

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-700"}>
        {icons[status]}
        {status}
      </Badge>
    )
  }

  const stats = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === "draft").length,
    sent: campaigns.filter(c => c.status === "sent").length,
    totalRecipients: campaigns.reduce((sum, c) => sum + (c.stats?.totalRecipients || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Email Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage email campaigns</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage your email campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading campaigns...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaigns.map((campaign) => (
                      <TableRow key={campaign._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{campaign.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{campaign.stats?.totalRecipients || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          {campaign.status === "sent" && (
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Sent:</span>
                                <span className="font-medium">{campaign.stats?.sent || 0}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Opened:</span>
                                <span className="font-medium">{campaign.stats?.opened || 0}</span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(campaign.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {campaign.status === "draft" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSend(campaign._id)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Send
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Email Campaign</DialogTitle>
            <DialogDescription>
              Create a new email campaign to send to users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Welcome Email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientType">Recipients *</Label>
              <Select
                value={form.recipientType}
                onValueChange={(value) => setForm({ ...form, recipientType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="role">By Role</SelectItem>
                  <SelectItem value="faculty">By Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.recipientType === "role" && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="dean">Deans</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.recipientType === "faculty" && (
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input
                  id="faculty"
                  value={form.faculty}
                  onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                  placeholder="e.g., Science"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Email subject line"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Email Content *</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Email message..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Campaign Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.name}</DialogTitle>
            <DialogDescription>Campaign details and statistics</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <p className="font-medium">{selectedCampaign?.subject}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Content</Label>
              <p className="text-sm whitespace-pre-wrap">{selectedCampaign?.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="mt-1">{selectedCampaign && getStatusBadge(selectedCampaign.status)}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Recipients</Label>
                <p className="font-medium">{selectedCampaign?.stats?.totalRecipients || 0}</p>
              </div>
            </div>
            {selectedCampaign?.status === "sent" && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Sent</Label>
                  <p className="text-2xl font-bold">{selectedCampaign.stats?.sent || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Opened</Label>
                  <p className="text-2xl font-bold">{selectedCampaign.stats?.opened || 0}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Clicked</Label>
                  <p className="text-2xl font-bold">{selectedCampaign.stats?.clicked || 0}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedCampaign(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
