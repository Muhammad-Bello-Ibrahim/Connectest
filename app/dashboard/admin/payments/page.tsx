"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock,
  Download, Filter, Search
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export default function PaymentsPage() {
  const transactions = [
    { id: "TXN001", club: "GDG", amount: 1500, status: "completed", date: "2024-05-03", user: "John Doe" },
    { id: "TXN002", club: "NACOS", amount: 2000, status: "completed", date: "2024-05-03", user: "Sarah Johnson" },
    { id: "TXN003", club: "Engineering Society", amount: 1000, status: "pending", date: "2024-05-02", user: "Michael Brown" },
    { id: "TXN004", club: "Debate Club", amount: 500, status: "failed", date: "2024-05-02", user: "Emily Chen" },
    { id: "TXN005", club: "Medical Students", amount: 2500, status: "completed", date: "2024-05-01", user: "David Wilson" },
  ]

  const stats = {
    totalRevenue: 125000,
    thisMonth: 34500,
    pendingPayments: 12,
    successRate: 94.5,
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Monitor transactions and payment settings</p>
        </div>
        <Button size="sm" className="w-full md:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">₦{stats.thisMonth.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+18% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Transaction success</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-10" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell className="font-medium">{txn.club}</TableCell>
                    <TableCell>{txn.user}</TableCell>
                    <TableCell className="font-semibold">₦{txn.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{txn.date}</TableCell>
                    <TableCell>
                      {txn.status === "completed" && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {txn.status === "pending" && (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {txn.status === "failed" && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Configuration
          </CardTitle>
          <CardDescription>Manage payment provider settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Paystack</h3>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Primary payment gateway for card payments
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="p-4 rounded-lg border opacity-60">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Flutterwave</h3>
                <Badge variant="outline">Inactive</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Alternative payment gateway
              </p>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
