"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Download, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for payments
const mockDuePayments = [
  {
    id: "1",
    club: "Computer Science Club",
    amount: 1500,
    dueDate: "2024-05-15",
    type: "Annual Membership",
  },
  {
    id: "2",
    club: "Photography Society",
    amount: 1000,
    dueDate: "2024-05-20",
    type: "Event Fee",
  },
]

const mockPaymentHistory = [
  {
    id: "101",
    club: "Computer Science Club",
    amount: 1500,
    date: "2023-09-10",
    status: "completed",
    type: "Annual Membership",
    reference: "PAY-CS-1234",
  },
  {
    id: "102",
    club: "Debate Club",
    amount: 800,
    date: "2023-10-05",
    status: "completed",
    type: "Registration Fee",
    reference: "PAY-DB-5678",
  },
  {
    id: "103",
    club: "Environmental Society",
    amount: 500,
    date: "2024-01-15",
    status: "completed",
    type: "Project Contribution",
    reference: "PAY-ENV-9012",
  },
]

export default function PaymentsPage() {
  const { toast } = useToast()
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  const handlePayment = async (paymentId: string, clubName: string, amount: number) => {
    setProcessingPayment(paymentId)

    try {
      // In a real app, this would integrate with Paystack API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Payment successful",
        description: `You have successfully paid ₦${amount} for ${clubName}.`,
      })

      // In a real app, you would refresh the data from the API
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "There was a problem processing your payment. Please try again.",
      })
    } finally {
      setProcessingPayment(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage your club payments and view payment history</p>
      </div>

      <Tabs defaultValue="due" className="space-y-4">
        <TabsList>
          <TabsTrigger value="due">Due Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="due" className="space-y-4">
          {mockDuePayments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {mockDuePayments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {payment.club}
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Due
                      </Badge>
                    </CardTitle>
                    <CardDescription>{payment.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₦{payment.amount.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">
                      Due by {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handlePayment(payment.id, payment.club, payment.amount)}
                      disabled={processingPayment === payment.id}
                    >
                      {processingPayment === payment.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Now
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Payments Due</CardTitle>
                <CardDescription>You don't have any pending payments at the moment.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your past payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.club}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.status === "completed" ? "outline" : "destructive"}
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {payment.status === "completed" ? "Completed" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download receipt</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Export All
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Paystack Dashboard
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

