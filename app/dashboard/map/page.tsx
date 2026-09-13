"use client"

import { useEffect, useState } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Place = { _id: string; title: string; description: string; category?: string; locationLabel?: string; mapX?: number; mapY?: number }

export default function CampusMapPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => { fetch("/api/campus-content?kind=place").then(async r => {
    if (!r.ok) throw new Error("Could not load campus places")
    const data = await r.json(); setPlaces(data.entries); setSelected(data.entries[0]?._id || null)
  }).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])
  const place = places.find(x => x._id === selected)
  return <div className="mx-auto max-w-5xl space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Explore campus</p><h1 className="text-3xl font-bold">Campus map</h1><p className="text-muted-foreground">Places published by Connectrix admins. Check the location description before visiting.</p></div>
    {loading ? <Loader2 className="animate-spin" /> : error ? <p role="alert">{error}</p> : places.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No campus places have been published yet.</CardContent></Card> : <>
      <div className="relative h-72 overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950 sm:h-96" aria-label="Illustrative campus map">
        <div className="absolute inset-10 rounded-[40%] border-[20px] border-white/50 rotate-[-18deg]" aria-hidden="true" />
        {places.filter(x => x.mapX != null && x.mapY != null).map(x => <Button key={x._id} size="icon" variant={selected === x._id ? "default" : "secondary"} className="absolute z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg" style={{ left: `${x.mapX}%`, top: `${x.mapY}%` }} onClick={() => setSelected(x._id)} aria-label={`Show ${x.title}`}><MapPin className="h-4 w-4" /></Button>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">{places.map(x => <button key={x._id} onClick={() => setSelected(x._id)} className={`w-full rounded-xl border p-4 text-left transition hover:border-primary ${selected === x._id ? "border-primary bg-primary/5" : "bg-card"}`}><strong>{x.title}</strong><span className="block text-sm text-muted-foreground">{x.locationLabel || x.category || "Campus place"}</span></button>)}</div>
        {place && <Card className="h-fit"><CardContent className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">Selected place</p><h2 className="mt-2 text-xl font-bold">{place.title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{place.description}</p>{place.locationLabel && <p className="mt-4 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" />{place.locationLabel}</p>}</CardContent></Card>}
      </div>
      <p className="text-xs text-muted-foreground">The illustration is for browsing places; it is not a navigation map.</p>
    </>}
  </div>
}
