"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type Receipt = { _id: string; receiptNumber: string; club: { _id: string; name: string } | string; student: { _id: string; name: string; studentId?: string } | string; period: string; amount: number; currency: string; method: string; receivedAt: string }
export function DuesReceiptCard({ receipt }: { receipt: Receipt }) {
  const clubName = typeof receipt.club === "string" ? receipt.club : receipt.club?.name
  const studentName = typeof receipt.student === "string" ? receipt.student : receipt.student?.name
  return <Card id="print-receipt" className="max-w-xl border-dashed"><CardContent className="space-y-3 p-6"><p className="text-xs font-bold uppercase tracking-widest text-primary">Connectrix · Club dues receipt</p><h2 className="text-xl font-bold">Payment received in person</h2><p className="text-xs text-muted-foreground">Issued by an authorized club officer. No online transaction took place.</p><dl className="grid grid-cols-2 gap-3 border-y py-4 text-sm"><dt className="text-muted-foreground">Receipt</dt><dd className="text-right font-semibold">{receipt.receiptNumber}</dd><dt className="text-muted-foreground">Club</dt><dd className="text-right">{clubName}</dd><dt className="text-muted-foreground">Student</dt><dd className="text-right">{studentName}</dd><dt className="text-muted-foreground">Period</dt><dd className="text-right">{receipt.period}</dd><dt className="text-muted-foreground">Received</dt><dd className="text-right">{new Date(receipt.receivedAt).toLocaleDateString()}</dd><dt className="text-muted-foreground">Method</dt><dd className="text-right capitalize">{receipt.method}</dd></dl><p className="text-right text-lg font-bold">₦{receipt.amount.toLocaleString()}</p><Button className="print-hide" variant="outline" onClick={() => window.print()}>Print receipt</Button></CardContent></Card>
}
