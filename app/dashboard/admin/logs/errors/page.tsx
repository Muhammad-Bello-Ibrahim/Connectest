"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, Search, CheckCircle2, XCircle, Download
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function ErrorLogsPage() {
  const { toast } = useToast()
  const [errors, setErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedError, setSelectedError] = useState<any>(null)
  const [resolveNotes, setResolveNotes] = useState("")
  const [filters, setFilters] = useState({
    severity: "all",
    errorType: "all",
    resolved: "all",
    search: "",
  })
  const [stats, setStats] = useState<any>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchErrors()
    fetchStats()
  }, [filters, pagination.page])

  const fetchErrors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: pagination.pageSize.toString(),
        skip: ((pagination.page - 1) * pagination.pageSize).toString(),
      })

      if (filters.severity !== "all") params.append("severity", filters.severity)
      if (filters.errorType !== "all") params.append("errorType", filters.errorType)
      if (filters.resolved !== "all") params.append("resolved", filters.resolved)

      const res = await fetch(`/api/admin/error-logs?${params}`)
      const data = await res.json()

      setErrors(data.errors || [])
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }))
    } catch (error) {
      console.error("Failed to fetch error logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/error-logs?stats=true")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleResolve = async () => {
    if (!selectedError) return

    try {
      const res = await fetch(`/api/admin/error-logs/${selectedError._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolvedBy: "admin-user-id", // TODO: Get from session
          notes: resolveNotes,
        }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Error marked as resolved",
        })
        setSelectedError(null)
        setResolveNotes("")
        fetchErrors()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve error",
        variant: "destructive",
      })
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors: any = {
      low: "bg-blue-100 text-blue-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700",
    }

    return (
      <Badge className={colors[severity] || "bg-gray-100 text-gray-700"}>
        {severity}
      </Badge>
    )
  }

  const filteredErrors = errors.filter(error => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        error.message?.toLowerCase().includes(searchLower) ||
        error.endpoint?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Error Logs
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and resolve system errors</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Errors
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unresolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.unresolved || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.bySeverity?.find((s: any) => s._id === "critical")?.count || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {errors.filter(e => e.resolved && new Date(e.resolvedAt).toDateString() === new Date().toDateString()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search errors..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.resolved} onValueChange={(value) => setFilters({ ...filters, resolved: value })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="false">Unresolved</SelectItem>
                  <SelectItem value="true">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading errors...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredErrors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No errors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredErrors.map((error) => (
                        <TableRow key={error._id} className="hover:bg-muted/50">
                          <TableCell className="text-sm">
                            {format(new Date(error.createdAt), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                          <TableCell className="text-sm">{error.errorType}</TableCell>
                          <TableCell className="max-w-xs truncate text-sm">{error.message}</TableCell>
                          <TableCell className="text-sm font-mono">{error.endpoint || "N/A"}</TableCell>
                          <TableCell>
                            {error.resolved ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                <XCircle className="h-3 w-3 mr-1" />
                                Open
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!error.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedError(error)}
                              >
                                Resolve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                  {pagination.total} errors
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Resolve Error Dialog */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Error</DialogTitle>
            <DialogDescription>
              Mark this error as resolved and add notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Error Message</Label>
              <p className="text-sm font-medium mt-1">{selectedError?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Resolution Notes</Label>
              <Textarea
                id="notes"
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="Describe how this error was resolved..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedError(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolve}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
