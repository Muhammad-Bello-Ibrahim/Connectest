"use client"

import { useAuth } from "@/hooks/use-auth"
import Newsfeed from "@/components/newsfeed"

export default function ClubDashboardPage() {
  const { user } = useAuth()

  return (
    <Newsfeed 
      title={`Welcome back, ${user?.name || "Club"}`}
      description="Share updates and engage with your club community"
    />
  )
}

