"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Wrench, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Listing = { _id: string; kind: "product" | "service" | "opportunity"; title: string; description: string; price: number; vendor: { _id: string; businessName: string } }
const icons = { product: ShoppingBag, service: Wrench, opportunity: Sparkles }
const labels = { product: "Product", service: "Service", opportunity: "Opportunity" }

export default function MarketplacePage() {
  const [kind, setKind] = useState("all")
  const [listings, setListings] = useState<Listing[]>([])
  const [selected, setSelected] = useState<Listing | null>(null)
  const [message, setMessage] = useState("")
  const [notice, setNotice] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/marketplace${kind === "all" ? "" : `?kind=${kind}`}`)
      if (!res.ok) throw new Error("Could not load listings")
      setListings((await res.json()).listings)
      setNotice("")
    } catch (e: any) { setNotice(e.message) } finally { setLoading(false) }
  }, [kind])
  useEffect(() => { load() }, [load])
  async function sendRequest(event: React.FormEvent) {
    event.preventDefault()
    if (!selected) return
    setSending(true)
    try {
      const res = await fetch("/api/marketplace/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId: selected._id, message }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setSelected(null); setMessage(""); setNotice(data.message)
    } catch (e: any) { setNotice(e.message) } finally { setSending(false) }
  }
  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Connect on campus</p><h1 className="text-3xl font-bold">Marketplace</h1><p className="text-muted-foreground">Discover products, services, and opportunities from approved campus vendors.</p></div><Button asChild><Link href="/dashboard/vendor">Vendor hub</Link></Button></div>
    <p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">Listings support inquiries only. Checkout and online payments are not active.</p>
    <div className="flex flex-wrap gap-2" aria-label="Marketplace categories">{["all", "product", "service", "opportunity"].map(x => <Button key={x} size="sm" variant={kind === x ? "default" : "outline"} onClick={() => setKind(x)}>{x === "all" ? "All" : `${labels[x as keyof typeof labels]}s`}</Button>)}</div>
    {notice && <p role="status" className="rounded-lg bg-primary/10 p-3 text-sm">{notice}</p>}
    {loading ? <Loader2 className="animate-spin" /> : listings.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No listings in this category yet.</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{listings.map(item => {
      const Icon = icons[item.kind]
      return <Card key={item._id} className="overflow-hidden"><div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 dark:from-emerald-950 dark:to-slate-900"><Icon className="h-12 w-12 text-primary" /></div><CardContent className="space-y-2 p-5"><span className="text-xs font-bold uppercase text-primary">{labels[item.kind]}</span><h2 className="font-bold">{item.title}</h2><p className="text-sm text-muted-foreground">{item.vendor.businessName}</p><div className="flex items-center justify-between gap-2"><strong>{item.kind === "opportunity" ? "Free" : `₦${item.price.toLocaleString()}`}</strong><Button size="sm" variant="outline" onClick={() => { setSelected(item); setNotice("") }}>View details</Button></div></CardContent></Card>
    })}</div>}
    {selected && <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 sm:items-center" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null) }}><section className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl" role="dialog" aria-modal="true" aria-label={selected.title}><div className="flex items-start justify-between gap-3"><div><span className="text-xs font-bold uppercase text-primary">{labels[selected.kind]}</span><h2 className="text-xl font-bold">{selected.title}</h2></div><Button variant="ghost" onClick={() => setSelected(null)}>Close</Button></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{selected.description}</p><p className="mt-3 text-sm">Offered by <strong>{selected.vendor.businessName}</strong></p><p className="mt-2 font-bold">{selected.kind === "opportunity" ? "Free" : `₦${selected.price.toLocaleString()}`}</p><form onSubmit={sendRequest} className="mt-5 space-y-3"><label htmlFor="inquiry" className="text-sm font-semibold">Your message to the vendor</label><Textarea id="inquiry" required minLength={5} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about availability, details, or how to participate" /><Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send inquiry"}</Button><p className="text-xs text-muted-foreground">No order or payment is created.</p></form></section></div>}
  </div>
}
