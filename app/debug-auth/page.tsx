"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DebugAuthPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [cookieCheck, setCookieCheck] = useState<string>("")
  const [verifyResult, setVerifyResult] = useState<any>(null)
  const [localUser, setLocalUser] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check cookies
    const cookies = document.cookie
    setCookieCheck(cookies)

    // Check localStorage safely (client-side only)
    if (typeof window !== "undefined") {
      setLocalUser(localStorage.getItem("connectrix-user"))
    }
  }, [])

  const testVerify = async () => {
    try {
      const res = await fetch("/api/auth/verify", {
        credentials: "include",
      })
      const data = await res.json()
      setVerifyResult({ status: res.status, data })
    } catch (error) {
      setVerifyResult({ error: String(error) })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug</h1>

      {/* Auth Context Info */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Context State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </div>
          <div>
            <strong>Authenticated:</strong> {isAuthenticated() ? "Yes" : "No"}
          </div>
          <div>
            <strong>User:</strong>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-2 bg-muted rounded text-xs overflow-auto">
            {cookieCheck || "No cookies found"}
          </pre>
        </CardContent>
      </Card>

      {/* Verify API */}
      <Card>
        <CardHeader>
          <CardTitle>Verify API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testVerify}>Test /api/auth/verify</Button>
          {verifyResult && (
            <pre className="p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(verifyResult, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* LocalStorage */}
      <Card>
        <CardHeader>
          <CardTitle>LocalStorage</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-2 bg-muted rounded text-xs overflow-auto">
            {localUser || "No user data in localStorage"}
          </pre>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
        <Button onClick={() => router.push("/dashboard/newsfeed")}>Go to Newsfeed</Button>
      </div>
    </div>
  )
}
