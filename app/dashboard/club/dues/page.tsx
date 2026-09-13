"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DuesReceiptCard, type Receipt } from "@/components/dues-receipt"

type Club = { _id: string; name: string; email: string; isPayable: boolean; membershipFeeAmount?: number; duesPeriod?: string }
type Member = { _id: string; name: string; studentId?: string }

export default function ClubDuesPage() {
  const { user } = useAuth()
  const [club, setClub] = useState<Club | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [studentId, setStudentId] = useState("")
  const [periodInput, setPeriodInput] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [notice, setNotice] = useState("")
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    if (!user?.email) return
    try {
      const res = await fetch("/api/clubs")
      if (!res.ok) throw new Error("Could not load club")
      const found: Club | undefined = (await res.json()).clubs.find((c: Club) => c.email?.toLowerCase() === user.email.toLowerCase())
      if (!found) throw new Error("Club account not found")
      setClub(found)
      setPeriodInput(found.duesPeriod || "Current semester")
      const dues = await fetch(`/api/dues?clubId=${found._id}`)
      if (!dues.ok) throw new Error("Could not load dues")
      const data = await dues.json(); setMembers(data.members); setReceipts(data.receipts)
    } catch (e: any) { setNotice(e.message) } finally { setLoading(false) }
  }, [user?.email])
  useEffect(() => { load() }, [load])
  async function record(event: FormEvent) {
    event.preventDefault()
    if (!club || !confirm) return
    const res = await fetch("/api/dues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clubId: club._id, studentId, period: club.duesPeriod || "Current semester", receivedInPerson: true }) })
    const data = await res.json()
    if (!res.ok) { setNotice(data.error || "Could not issue receipt"); return }
    setNotice("Payment recorded. The student can see the receipt in My receipts.")
    setSelected(data.receipt._id); setStudentId(""); setConfirm(false); await load()
  }
  async function updatePeriod(event: FormEvent) {
    event.preventDefault()
    if (!club) return
    const res = await fetch(`/api/clubs/${club._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ duesPeriod: periodInput.trim() }) })
    const data = await res.json()
    setNotice(res.ok ? "Dues period updated. Existing receipts remain unchanged." : data.error || "Could not update period")
    if (res.ok) setClub({ ...club, duesPeriod: periodInput.trim() })
  }
  return <div className="mx-auto max-w-5xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Club administration</p><h1 className="text-3xl font-bold">Dues & receipts</h1><p className="text-muted-foreground">Record only payments your club actually received in person.</p></div>{notice && <p role="status" className="rounded-lg bg-primary/10 p-3 text-sm">{notice}</p>}{loading ? <p>Loading…</p> : club && <>
    <Card><CardHeader><CardTitle>{club.name} · {club.duesPeriod || "Current semester"}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{club.isPayable ? `Dues: ₦${(club.membershipFeeAmount || 0).toLocaleString()}` : "Dues collection is disabled for this club."}</p></CardContent></Card>
    <form onSubmit={updatePeriod} className="flex flex-wrap items-end gap-2 print-hide"><label className="space-y-1 text-sm font-medium">Current dues period<input required minLength={3} maxLength={80} className="flex h-10 w-64 rounded-md border bg-background px-3" value={periodInput} onChange={e => setPeriodInput(e.target.value)} /></label><Button type="submit" variant="outline" disabled={periodInput.trim() === (club.duesPeriod || "Current semester")}>Update period</Button></form>
    {club.isPayable && (club.membershipFeeAmount || 0) > 0 && <Card className="print-hide"><CardHeader><CardTitle>Record in-person payment</CardTitle></CardHeader><CardContent><form onSubmit={record} className="space-y-4"><label className="block space-y-1 text-sm font-medium">Eligible member<select required className="flex h-10 w-full rounded-md border bg-background px-3" value={studentId} onChange={e => setStudentId(e.target.value)}><option value="">Select a member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name}{m.studentId ? ` · ${m.studentId}` : ""}</option>)}</select></label><label className="flex items-start gap-2 text-sm"><input required type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} className="mt-1" />I confirm this club received the exact dues amount in person for this period.</label><Button type="submit" disabled={!studentId || !confirm}>Record payment and issue receipt</Button></form></CardContent></Card>}
    <div className="print-hide"><h2 className="mb-3 text-xl font-bold">Club copies</h2><div className="flex flex-wrap gap-2">{receipts.map(r => <Button key={r._id} variant={selected === r._id ? "default" : "outline"} size="sm" onClick={() => setSelected(r._id)}>{typeof r.student === "string" ? r.student : r.student?.name} · {r.receiptNumber}</Button>)}</div>{receipts.length === 0 && <p className="text-sm text-muted-foreground">No payments recorded yet.</p>}</div>
    {receipts.filter(r => r._id === selected).map(r => <DuesReceiptCard key={r._id} receipt={{ ...r, club: { _id: club._id, name: club.name } }} />)}
  </>}
  </div>
}
