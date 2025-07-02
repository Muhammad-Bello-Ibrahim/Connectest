"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      toast({ title: "Check your email", description: "A reset link has been sent if the email exists." })
    } else {
      toast({ title: "Error", description: data.error || "Request failed", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow w-full max-w-md flex flex-col gap-4 border">
        <h1 className="text-xl font-bold mb-2">Forgot Password</h1>
        <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
      </form>
    </div>
  )
}
