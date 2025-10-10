"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Database, HardDrive, Download, Upload, RefreshCw, Trash2,
  CheckCircle2, Clock, AlertTriangle, Server, Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function DatabasePage() {
  const { toast } = useToast()

  const collections = [
    { name: "users", documents: 1248, size: "45.2 MB", indexes: 5, status: "healthy" },
    { name: "clubs", documents: 87, size: "12.8 MB", indexes: 3, status: "healthy" },
    { name: "events", documents: 234, size: "18.5 MB", indexes: 4, status: "healthy" },
    { name: "posts", documents: 1567, size: "89.3 MB", indexes: 6, status: "warning" },
    { name: "comments", documents: 3421, size: "67.1 MB", indexes: 4, status: "healthy" },
  ]

  const backupHistory = [
    { id: 1, date: "2024-05-03 02:00:00", size: "234.5 MB", status: "completed", duration: "2m 34s" },
    { id: 2, date: "2024-05-02 02:00:00", size: "232.1 MB", status: "completed", duration: "2m 28s" },
    { id: 3, date: "2024-05-01 02:00:00", size: "229.8 MB", status: "completed", duration: "2m 31s" },
    { id: 4, date: "2024-04-30 02:00:00", size: "227.3 MB", status: "failed", duration: "0m 45s" },
  ]

  const handleBackup = () => {
    toast({
      title: "Backup Started",
      description: "Database backup is in progress...",
    })
  }

  const handleRestore = () => {
    toast({
      title: "Restore Initiated",
      description: "Database restore process has started.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Database Management
        </h1>
        <p className="text-muted-foreground mt-1">Monitor and manage database operations</p>
      </div>

      {/* Database Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">234.5 MB</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">68% of 350 MB limit</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{collections.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active collections</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6,557</div>
            <p className="text-xs text-muted-foreground mt-1">Across all collections</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1 day</div>
            <p className="text-xs text-muted-foreground mt-1">ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Collections
            </CardTitle>
            <CardDescription>Database collections overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collections.map((collection, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {collection.documents.toLocaleString()} docs • {collection.size}
                      </div>
                    </div>
                  </div>
                  <Badge variant={collection.status === "healthy" ? "default" : "outline"}>
                    {collection.status === "healthy" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {collection.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Backup History
                </CardTitle>
                <CardDescription>Recent backup operations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {backup.status === "completed" ? (
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{backup.date}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {backup.size} • Duration: {backup.duration}
                        </p>
                      </div>
                      <Badge variant={backup.status === "completed" ? "default" : "destructive"}>
                        {backup.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Database Operations</CardTitle>
          <CardDescription>Manage backups and maintenance tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button onClick={handleBackup} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
            <Button variant="outline" onClick={handleRestore} className="justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Restore Backup
            </Button>
            <Button variant="outline" className="justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Optimize Database
            </Button>
            <Button variant="outline" className="justify-start text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Database performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Query Performance</span>
                <span className="font-medium">Excellent</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connection Pool</span>
                <span className="font-medium">Good</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Index Efficiency</span>
                <span className="font-medium">Optimal</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
