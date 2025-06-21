"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Edit, Trash, UserPlus, Lock, UserX } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    studentId: "UG20/SCCS/1026",
    faculty: "Science",
    department: "Computer Science",
    status: "active",
    lastLogin: "2024-05-01T10:30:00",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "student",
    studentId: "UG21/ASPS/2045",
    faculty: "Arts and Social Science",
    department: "Political Science",
    status: "active",
    lastLogin: "2024-05-02T14:15:00",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "student",
    studentId: "UG19/MDMS/3012",
    faculty: "Medical Sciences",
    department: "Medicine",
    status: "inactive",
    lastLogin: "2024-04-15T09:45:00",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    role: "dean",
    faculty: "Science",
    status: "active",
    lastLogin: "2024-05-03T08:20:00",
  },
  {
    id: "5",
    name: "Prof. Emily Chen",
    email: "emily.chen@example.com",
    role: "dean",
    faculty: "Arts and Social Science",
    status: "active",
    lastLogin: "2024-05-02T11:10:00",
  },
  {
    id: "6",
    name: "System Administrator",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-05-03T07:30:00",
  },
]

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [users, setUsers] = useState(mockUsers)

  // Filter users based on search query and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.faculty && user.faculty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"

    return matchesSearch && user.role === activeTab
  })

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )

    const user = users.find((u) => u.id === userId)
    const newStatus = user?.status === "active" ? "inactive" : "active"

    toast({
      title: `User ${newStatus}`,
      description: `${user?.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)

    setUsers(users.filter((user) => user.id !== userId))

    toast({
      title: "User deleted",
      description: `${user?.name} has been deleted from the system.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" className="h-9 gap-1">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="dean">Deans</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Faculty/Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : user.role === "dean"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.faculty ? (
                            <>
                              {user.faculty}
                              {user.department && (
                                <div className="text-xs text-muted-foreground">{user.department}</div>
                              )}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.status === "active"}
                              onCheckedChange={() => toggleUserStatus(user.id)}
                              id={`status-${user.id}`}
                            />
                            <Label htmlFor={`status-${user.id}`}>
                              {user.status === "active" ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.lastLogin).toLocaleDateString()}{" "}
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.lastLogin).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Lock className="h-4 w-4" />
                              <span className="sr-only">Reset Password</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserX className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No users found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">No users match your current search criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Across all roles</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.filter((user) => user.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((users.filter((user) => user.status === "active").length / users.length) * 100)}% of total
                  users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Users (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+8% from previous period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

