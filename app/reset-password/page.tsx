"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword })
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      toast({ title: "Password reset!", description: "You can now log in." })
      router.push("/login")
    } else {
      toast({ title: "Error", description: data.error || "Reset failed", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow w-full max-w-md flex flex-col gap-4 border">
        <h1 className="text-xl font-bold mb-2">Reset Password</h1>
        <Input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
        <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
