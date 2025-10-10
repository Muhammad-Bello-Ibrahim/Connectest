"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Upload, Download, Mail, Users, FileText, CheckCircle2, XCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function BulkOperationsPage() {
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [sending, setSending] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)
  
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    recipientType: "all",
    role: "",
    faculty: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      
      // Parse CSV file
      const text = await file.text()
      const lines = text.split("\n")
      const headers = lines[0].split(",").map(h => h.trim())
      
      const users = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(",").map(v => v.trim())
        const user: any = {}
        
        headers.forEach((header, index) => {
          user[header.toLowerCase()] = values[index]
        })
        
        users.push(user)
      }

      // Send to API
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users,
          adminId: "admin-user-id", // TODO: Get from session
        }),
      })

      const data = await res.json()
      setImportResults(data.results)

      toast({
        title: "Import Complete",
        description: `${data.successCount} users imported, ${data.failedCount} failed`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import users",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)

      const res = await fetch("/api/admin/users/bulk")
      const data = await res.json()

      // Convert to CSV
      const headers = Object.keys(data.users[0])
      const csv = [
        headers.join(","),
        ...data.users.map((user: any) => 
          headers.map(h => user[h]).join(",")
        ),
      ].join("\n")

      // Download file
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-export-${new Date().toISOString()}.csv`
      a.click()

      toast({
        title: "Export Complete",
        description: `${data.total} users exported`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export users",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailForm.subject || !emailForm.message) {
      toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive",
      })
      return
    }

    try {
      setSending(true)

      let recipients: any = emailForm.recipientType

      if (emailForm.recipientType === "filtered") {
        recipients = {
          role: emailForm.role || undefined,
          faculty: emailForm.faculty || undefined,
        }
      }

      const res = await fetch("/api/admin/users/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailForm.subject,
          message: emailForm.message,
          recipients,
          adminId: "admin-user-id", // TODO: Get from session
        }),
      })

      const data = await res.json()

      toast({
        title: "Email Sent",
        description: `Email sent to ${data.results.sent} users`,
      })

      setEmailForm({
        subject: "",
        message: "",
        recipientType: "all",
        role: "",
        faculty: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Bulk Operations
        </h1>
        <p className="text-muted-foreground mt-1">Perform bulk actions on users</p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Users
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <Download className="h-4 w-4" />
            Export Users
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Bulk Email
          </TabsTrigger>
        </TabsList>

        {/* Import Users */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Users from CSV
              </CardTitle>
              <CardDescription>
                Upload a CSV file to bulk import users. Required columns: name, email, password, role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="text-lg font-medium mb-2">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-sm text-muted-foreground">
                      CSV file (max 10MB)
                    </div>
                  </Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={importing}
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium mb-2">CSV Format Example:</h4>
                  <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto">
{`name,email,password,role,faculty,department
John Doe,john@example.com,password123,student,Science,Computer Science
Jane Smith,jane@example.com,password123,student,Arts,English`}
                  </pre>
                </div>
              </div>

              {importing && (
                <div className="text-center py-4">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-sm text-muted-foreground">Importing users...</p>
                </div>
              )}

              {importResults && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Successful
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          {importResults.success.length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Failed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                          {importResults.failed.length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {importResults.failed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Failed Imports:</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {importResults.failed.map((item: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.email}</p>
                              <p className="text-xs text-muted-foreground">{item.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Users */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Users to CSV
              </CardTitle>
              <CardDescription>
                Download all user data as a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Download className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Export User Data</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Download a CSV file containing all user information
                </p>
                <Button onClick={handleExport} disabled={exporting}>
                  {exporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export All Users
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium mb-2">Export includes:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Name and Email</li>
                  <li>Role and Status</li>
                  <li>Faculty and Department</li>
                  <li>State and Religion</li>
                  <li>Account creation date</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Email */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Bulk Email
              </CardTitle>
              <CardDescription>
                Send email to multiple users at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select
                    value={emailForm.recipientType}
                    onValueChange={(value) => setEmailForm({ ...emailForm, recipientType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Users</SelectItem>
                      <SelectItem value="filtered">Filtered Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {emailForm.recipientType === "filtered" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={emailForm.role}
                        onValueChange={(value) => setEmailForm({ ...emailForm, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Roles</SelectItem>
                          <SelectItem value="student">Students</SelectItem>
                          <SelectItem value="dean">Deans</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty</Label>
                      <Input
                        id="faculty"
                        value={emailForm.faculty}
                        onChange={(e) => setEmailForm({ ...emailForm, faculty: e.target.value })}
                        placeholder="e.g., Science"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    placeholder="Email message..."
                    rows={8}
                  />
                </div>

                <Button onClick={handleSendEmail} disabled={sending} className="w-full">
                  {sending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
