"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen, ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Resource = { _id: string; title: string; description: string; category?: string; url?: string }

export default function ResourcesPage() {
  const [entries, setEntries] = useState<Resource[]>([])
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => { fetch("/api/campus-content?kind=resource").then(async r => {
    if (!r.ok) throw new Error("Could not load resources")
    setEntries((await r.json()).entries)
  }).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])
  const categories = useMemo(() => ["All", ...Array.from(new Set(entries.map(x => x.category).filter(Boolean)))], [entries])
  return <div className="mx-auto max-w-5xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Learn and explore</p><h1 className="text-3xl font-bold">Resources</h1><p className="text-muted-foreground">Guides and links published for your campus community.</p></div>
    <div className="flex flex-wrap gap-2">{categories.map(x => <Button key={x} variant={category === x ? "default" : "outline"} size="sm" onClick={() => setCategory(x || "All")}>{x}</Button>)}</div>
    {loading ? <Loader2 className="animate-spin" /> : error ? <p role="alert">{error}</p> : entries.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No resources have been published yet.</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2">{entries.filter(x => category === "All" || x.category === category).map(x => <Card key={x._id}><CardContent className="p-5"><BookOpen className="mb-4 h-6 w-6 text-primary" /><span className="text-xs font-semibold uppercase tracking-wider text-primary">{x.category || "Campus resource"}</span><h2 className="mt-2 font-bold">{x.title}</h2><p className="my-3 text-sm leading-relaxed text-muted-foreground">{x.description}</p>{x.url && <a className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline" href={x.url} target="_blank" rel="noopener noreferrer">Open resource <ExternalLink className="h-4 w-4" /></a>}</CardContent></Card>)}</div>}
  </div>
}
