"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import NewsfeedModern from "@/components/newsfeed-modern"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Secure redirect for unauthorized or wrong-role users
  useEffect(() => {
    if (!user || user.role !== "student") {
      router.replace("/login")
    }
  }, [user, router])

  if (!user || user.role !== "student") return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">{user.name}</span>! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover clubs and connect with your university community
          </p>
        </div>

        {/* Newsfeed */}
        <NewsfeedModern 
          title={`Welcome back, ${user.name}`}
          description="Discover clubs and connect with your university community"
        />
      </div>
    </div>
  )
}