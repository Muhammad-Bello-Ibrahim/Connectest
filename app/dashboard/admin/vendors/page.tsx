"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Vendor = { _id: string; businessName: string; description: string; address: string; category: string; owner: { name: string; email: string } }

export default function VendorReviewsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [notice, setNotice] = useState("")
  const [review, setReview] = useState<Record<string, { identityChecked: boolean; premisesChecked: boolean; identityReviewReference: string; premisesReviewReference: string }>>({})
  const load = useCallback(async () => {
    const res = await fetch("/api/vendors?review=1")
    if (res.ok) setVendors((await res.json()).vendors)
    else setNotice("Could not load pending reviews")
  }, [])
  useEffect(() => { load() }, [load])
  async function decide(event: FormEvent, id: string, decision: "approved" | "rejected") {
    event.preventDefault()
    const current = review[id] || { identityChecked: false, premisesChecked: false, identityReviewReference: "", premisesReviewReference: "" }
    const res = await fetch(`/api/vendors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision, ...current }) })
    const data = await res.json()
    setNotice(res.ok ? `Vendor ${decision}.` : data.error || "Review failed")
    if (res.ok) load()
  }
  function change(id: string, key: string, value: string | boolean) { setReview(prev => ({ ...prev, [id]: { ...(prev[id] || { identityChecked: false, premisesChecked: false, identityReviewReference: "", premisesReviewReference: "" }), [key]: value } })) }
  return <div className="mx-auto max-w-5xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Marketplace administration</p><h1 className="text-3xl font-bold">Vendor reviews</h1><p className="text-muted-foreground">Review actual business evidence through an authorized process before approving a vendor.</p></div><p className="rounded-xl border bg-muted/40 p-3 text-sm text-muted-foreground">Enter case references only. Do not paste identity numbers, bank account details, or video content here. Approval permits listings; payouts stay disabled.</p>{notice && <p role="status">{notice}</p>}
    {vendors.length === 0 ? <Card><CardContent className="py-10 text-center text-muted-foreground">No pending applications.</CardContent></Card> : vendors.map(v => <Card key={v._id}><CardContent className="space-y-4 p-6"><div><h2 className="text-xl font-bold">{v.businessName}</h2><p className="text-sm text-muted-foreground">{v.owner?.name} · {v.owner?.email} · {v.category}</p><p className="mt-2 text-sm">{v.description}</p><p className="text-sm">Location: {v.address}</p></div><form onSubmit={e => decide(e, v._id, "approved")} className="space-y-4 border-t pt-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Identity review case<Input required placeholder="CASE-IDENTITY-..." value={review[v._id]?.identityReviewReference || ""} onChange={e => change(v._id, "identityReviewReference", e.target.value)} /></label><label className="text-sm">Premises/product review case<Input required placeholder="CASE-PREMISES-..." value={review[v._id]?.premisesReviewReference || ""} onChange={e => change(v._id, "premisesReviewReference", e.target.value)} /></label></div><label className="flex gap-2 text-sm"><input type="checkbox" checked={review[v._id]?.identityChecked || false} onChange={e => change(v._id, "identityChecked", e.target.checked)} /> Identity reviewed independently</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={review[v._id]?.premisesChecked || false} onChange={e => change(v._id, "premisesChecked", e.target.checked)} /> Premises or products reviewed independently</label><div className="flex gap-2"><Button type="submit" disabled={!review[v._id]?.identityChecked || !review[v._id]?.premisesChecked}>Approve listing access</Button><Button type="button" variant="outline" onClick={e => decide(e as unknown as FormEvent, v._id, "rejected")}>Reject</Button></div></form></CardContent></Card>)}
  </div>
}
