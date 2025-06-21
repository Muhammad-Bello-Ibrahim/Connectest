"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DeanSidebar } from "@/components/dean-sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, getRedirectPath } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user) {
      const correctPath = getRedirectPath()

      // Only redirect if user is on the wrong dashboard
      if (user.role === "dean" && !pathname.includes("/dashboard/dean")) {
        router.push(correctPath)
      } else if (user.role === "admin" && !pathname.includes("/dashboard/admin")) {
        router.push(correctPath)
      } else if (
        user.role === "student" &&
        (pathname.includes("/dashboard/dean") || pathname.includes("/dashboard/admin"))
      ) {
        router.push(correctPath)
      }
    }
  }, [user, isLoading, router, pathname, getRedirectPath])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Render different sidebar based on user role
  const renderSidebar = () => {
    if (user.role === "dean") {
      return <DeanSidebar />
    } else if (user.role === "admin") {
      return <AdminSidebar />
    } else {
      return <DashboardSidebar />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        {renderSidebar()}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

