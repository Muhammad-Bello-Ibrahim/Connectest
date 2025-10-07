"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Newsfeed from "@/components/newsfeed"

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
    <Newsfeed 
      title={`Welcome back, ${user.name}`}
      description="Discover clubs and connect with your university community"
    />
  )
}