"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, ShieldCheck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Vendor = { _id: string; businessName: string; description: string; address: string; category: string; status: "pending" | "approved" | "rejected" | "suspended" }
type Listing = { _id: string; title: string; kind: string; price: number; vendor: { _id: string } }
type Inquiry = { _id: string; message: string; status: string; requester: { name: string; email: string }; listing: { title: string } }

export default function VendorPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [requests, setRequests] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const [business, setBusiness] = useState({ businessName: "", description: "", address: "", category: "products" })
  const [listing, setListing] = useState({ title: "", description: "", kind: "product", price: "" })
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/vendors")
      if (!response.ok) throw new Error("Could not load vendor account")
      const data = await response.json(); setVendor(data.vendor)
      if (data.vendor?.status === "approved") {
        const [items, inquiries] = await Promise.all([fetch("/api/marketplace?mine=1"), fetch("/api/marketplace/requests")])
        if (items.ok) setListings((await items.json()).listings)
        if (inquiries.ok) setRequests((await inquiries.json()).requests)
      }
    } catch (e: any) { setNotice(e.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => { refresh() }, [refresh])
  async function submit(event: FormEvent, path: string, payload: unknown) {
    event.preventDefault(); setSaving(true); setNotice("")
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not save")
      setNotice(path === "/api/vendors" ? "Application submitted for review." : "Listing published.")
      if (path !== "/api/vendors") setListing({ title: "", description: "", kind: "product", price: "" })
      await refresh()
    } catch (e: any) { setNotice(e.message) } finally { setSaving(false) }
  }
  return <div className="mx-auto max-w-5xl space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Campus commerce</p><h1 className="text-3xl font-bold">Vendor hub</h1><p className="text-muted-foreground">Apply for a store, publish listings, and respond to student interest.</p></div><Button asChild variant="outline"><Link href="/dashboard/marketplace">Browse marketplace</Link></Button></div>
    <p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">No payments or payouts are enabled. Never enter identity numbers, bank details, or verification videos here; authorized review happens outside this form.</p>
    {notice && <p role="status" className="rounded-lg bg-primary/10 p-3 text-sm">{notice}</p>}
    {loading ? <Loader2 className="animate-spin" /> : !vendor ? <Card><CardHeader><CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Become a vendor</CardTitle></CardHeader><CardContent><form onSubmit={e => submit(e, "/api/vendors", business)} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Business name<Input required minLength={3} maxLength={100} value={business.businessName} onChange={e => setBusiness({ ...business, businessName: e.target.value })} /></label><label className="space-y-1 text-sm font-medium">Category<select className="flex h-10 w-full rounded-md border bg-background px-3" value={business.category} onChange={e => setBusiness({ ...business, category: e.target.value })}><option value="products">Products</option><option value="services">Services</option><option value="both">Both</option></select></label><label className="space-y-1 text-sm font-medium sm:col-span-2">Business address<Input required minLength={8} maxLength={200} value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })} /></label><label className="space-y-1 text-sm font-medium sm:col-span-2">About your business<Textarea required minLength={10} maxLength={500} value={business.description} onChange={e => setBusiness({ ...business, description: e.target.value })} /></label><Button type="submit" disabled={saving}>Submit application</Button></form></CardContent></Card> : <>
      <Card><CardContent className="flex flex-wrap items-center justify-between gap-4 p-6"><div><h2 className="text-xl font-bold">{vendor.businessName}</h2><p className="text-sm text-muted-foreground">{vendor.address}</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">{vendor.status}</span></CardContent></Card>
      {vendor.status !== "approved" ? <Card><CardContent className="flex gap-3 p-6"><ShieldCheck className="h-6 w-6 shrink-0 text-primary" /><div><h2 className="font-semibold">{vendor.status === "pending" ? "Under review" : "Review needed"}</h2><p className="text-sm text-muted-foreground">An administrator must review identity and business premises outside this form before listings can be published. Contact the Connectrix team if your application needs an update.</p></div></CardContent></Card> : <>
        <Card><CardHeader><CardTitle>Create a listing</CardTitle></CardHeader><CardContent><form onSubmit={e => submit(e, "/api/marketplace", { ...listing, price: listing.kind === "opportunity" ? 0 : Number(listing.price) })} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Type<select className="flex h-10 w-full rounded-md border bg-background px-3" value={listing.kind} onChange={e => setListing({ ...listing, kind: e.target.value })}><option value="product">Product</option><option value="service">Service</option><option value="opportunity">Opportunity</option></select></label><label className="space-y-1 text-sm font-medium">Price (₦)<Input type="number" min="1" max="100000000" required={listing.kind !== "opportunity"} disabled={listing.kind === "opportunity"} value={listing.kind === "opportunity" ? "0" : listing.price} onChange={e => setListing({ ...listing, price: e.target.value })} /></label><label className="space-y-1 text-sm font-medium sm:col-span-2">Title<Input required minLength={3} maxLength={100} value={listing.title} onChange={e => setListing({ ...listing, title: e.target.value })} /></label><label className="space-y-1 text-sm font-medium sm:col-span-2">Description<Textarea required minLength={10} maxLength={2000} value={listing.description} onChange={e => setListing({ ...listing, description: e.target.value })} /></label><Button type="submit" disabled={saving}>Publish listing</Button></form></CardContent></Card>
        <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>Your listings</CardTitle></CardHeader><CardContent className="space-y-3">{listings.length ? listings.map(x => <div key={x._id} className="border-b pb-2 text-sm"><strong>{x.title}</strong><span className="block capitalize text-muted-foreground">{x.kind} · {x.price ? `₦${x.price.toLocaleString()}` : "Free"}</span></div>) : <p className="text-sm text-muted-foreground">No listings yet.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Student inquiries</CardTitle></CardHeader><CardContent className="space-y-3">{requests.length ? requests.map(x => <div key={x._id} className="border-b pb-3 text-sm"><strong>{x.listing?.title}</strong><p className="text-muted-foreground">{x.message}</p><p>{x.requester?.name} · {x.requester?.email}</p></div>) : <p className="text-sm text-muted-foreground">No inquiries yet.</p>}</CardContent></Card></div>
      </>}
    </>}
  </div>
}
