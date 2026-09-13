"use client"

import { FormEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Entry = { _id: string; title: string; kind: string; category?: string }
export default function CampusAdminPage() {
  const [kind, setKind] = useState<"place" | "resource">("place")
  const [entries, setEntries] = useState<Entry[]>([])
  const [notice, setNotice] = useState("")
  const [data, setData] = useState({ title: "", description: "", category: "", locationLabel: "", mapX: "", mapY: "", url: "" })
  useEffect(() => { fetch(`/api/campus-content?kind=${kind}`).then(r => r.json()).then(x => setEntries(x.entries || [])).catch(() => setNotice("Could not load content")) }, [kind])
  async function publish(event: FormEvent) {
    event.preventDefault()
    const payload = { kind, title: data.title, description: data.description, category: data.category, ...(kind === "place" ? { locationLabel: data.locationLabel, ...(data.mapX !== "" && data.mapY !== "" ? { mapX: Number(data.mapX), mapY: Number(data.mapY) } : {}) } : { url: data.url }) }
    const res = await fetch("/api/campus-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    setNotice(res.ok ? "Published." : (await res.json()).error || "Could not publish")
    if (res.ok) {
      setData({ title: "", description: "", category: "", locationLabel: "", mapX: "", mapY: "", url: "" })
      const latest = await fetch(`/api/campus-content?kind=${kind}`)
      if (latest.ok) setEntries((await latest.json()).entries)
    }
  }
  return <div className="mx-auto max-w-5xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Campus administration</p><h1 className="text-3xl font-bold">Places & resources</h1><p className="text-muted-foreground">Publish verified campus information to students.</p></div><div className="flex gap-2"><Button variant={kind === "place" ? "default" : "outline"} onClick={() => setKind("place")}>Places</Button><Button variant={kind === "resource" ? "default" : "outline"} onClick={() => setKind("resource")}>Resources</Button></div>{notice && <p role="status">{notice}</p>}
    <Card><CardContent className="p-6"><h2 className="mb-4 font-bold">Add {kind}</h2><form onSubmit={publish} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm">Title<Input required minLength={3} maxLength={100} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} /></label><label className="space-y-1 text-sm">Category<Input maxLength={60} value={data.category} onChange={e => setData({ ...data, category: e.target.value })} /></label><label className="space-y-1 text-sm sm:col-span-2">Description<Textarea required minLength={10} maxLength={1000} value={data.description} onChange={e => setData({ ...data, description: e.target.value })} /></label>{kind === "place" ? <><label className="space-y-1 text-sm sm:col-span-2">Location description<Input maxLength={150} value={data.locationLabel} onChange={e => setData({ ...data, locationLabel: e.target.value })} /></label><label className="space-y-1 text-sm">Illustration X %<Input type="number" min="0" max="100" value={data.mapX} onChange={e => setData({ ...data, mapX: e.target.value })} /></label><label className="space-y-1 text-sm">Illustration Y %<Input type="number" min="0" max="100" value={data.mapY} onChange={e => setData({ ...data, mapY: e.target.value })} /></label></> : <label className="space-y-1 text-sm sm:col-span-2">HTTPS link (optional)<Input type="url" value={data.url} onChange={e => setData({ ...data, url: e.target.value })} /></label>}<Button type="submit">Publish</Button></form></CardContent></Card>
    <div className="space-y-2"><h2 className="font-bold">Published {kind}s</h2>{entries.map(x => <p key={x._id} className="rounded-lg border bg-card p-3 text-sm"><strong>{x.title}</strong> · {x.category || kind}</p>)}{entries.length === 0 && <p className="text-sm text-muted-foreground">Nothing published yet.</p>}</div>
  </div>
}
