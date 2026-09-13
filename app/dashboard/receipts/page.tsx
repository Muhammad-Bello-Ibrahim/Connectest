"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DuesReceiptCard, type Receipt } from "@/components/dues-receipt"

export default function MyReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => { fetch("/api/dues").then(async r => {
    if (!r.ok) throw new Error("Could not load receipts")
    const data = await r.json(); setReceipts(data.receipts); setSelected(data.receipts[0]?._id || null)
  }).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])
  return <div className="mx-auto max-w-4xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Your records</p><h1 className="text-3xl font-bold">Club dues receipts</h1><p className="text-muted-foreground">A receipt appears here after a club officer records a payment received in person.</p></div>
    {loading ? <Loader2 className="animate-spin" /> : error ? <p role="alert">{error}</p> : receipts.length === 0 ? <p className="rounded-xl border bg-card p-8 text-muted-foreground">You have no receipts yet.</p> : <><div className="flex flex-wrap gap-2 print-hide">{receipts.map(r => <Button key={r._id} size="sm" variant={selected === r._id ? "default" : "outline"} onClick={() => setSelected(r._id)}>{r.receiptNumber}</Button>)}</div>{receipts.filter(r => r._id === selected).map(r => <DuesReceiptCard key={r._id} receipt={r} />)}</>}
  </div>
}
