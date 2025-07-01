"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DeanSidebar } from "@/components/dean-sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, getRedirectPath } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/auth/login")
    } else {
      const correctPath = getRedirectPath()
      if (
        (user.role === "admin" && !pathname.startsWith("/dashboard/admin")) ||
        (user.role === "dean" && !pathname.startsWith("/dashboard/dean")) ||
        (user.role === "student" && pathname !== "/dashboard")
      ) {
        router.replace(correctPath)
      }
    }
  }, [user, isLoading, pathname, router])

  const renderSidebar = () => {
    if (user?.role === "admin") return <AdminSidebar />
    if (user?.role === "dean") return <DeanSidebar />
    return <DashboardSidebar />
  }

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-auto" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
