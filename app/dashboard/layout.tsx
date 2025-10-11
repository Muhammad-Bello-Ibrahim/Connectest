"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ClubSidebar } from "@/components/club-sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, getRedirectPath } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect after authentication check is complete
    if (isLoading) return

    if (!user) {
      router.replace("/login")
    } else {
      // Role-based access control
      if (user.role === "admin" && !pathname.startsWith("/dashboard/admin")) {
        router.replace("/dashboard/admin")
      } else if (user.role === "club" && !pathname.startsWith("/dashboard/club")) {
        router.replace("/dashboard/club")
      } else if (user.role === "student") {
        // Students should not access admin or club management routes
        // Note: /dashboard/clubs (plural) is for browsing clubs - allowed
        // /dashboard/club (singular) is for club management - blocked
        if (pathname.startsWith("/dashboard/admin") || 
            (pathname.startsWith("/dashboard/club") && pathname !== "/dashboard/clubs" && !pathname.startsWith("/dashboard/clubs/"))) {
          router.replace("/dashboard")
        }
      }
    }
  }, [user, isLoading, pathname, router])

  // Show loading while authentication is being verified
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto my-auto" />
      </div>
    )
  }

  // Don't render anything if user is not authenticated yet
  if (!user) {
    return null
  }

  const renderSidebar = () => {
    if (user?.role === "admin") return <AdminSidebar />
    if (user?.role === "club") return <ClubSidebar />
    return <DashboardSidebar />
  }

  const isAdminRoute = pathname.startsWith("/dashboard/admin")

  const isDashboardHome = pathname === "/dashboard"

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          {renderSidebar()}
        </div>
        
        {/* Main Content */}
        <main className={`flex-1 w-full ${
          isDashboardHome 
            ? 'p-4' 
            : isAdminRoute 
              ? 'p-6 md:p-8 lg:p-12 pb-20 md:pb-4' 
              : 'p-4 pb-20 md:pb-4'
        }`}>
          {/* Mobile Header - Visible only on mobile, but not on dashboard home */}
          {!isDashboardHome && (
            <div className="md:hidden mb-4">
              <DashboardHeader />
            </div>
          )}
          
          <div className={isAdminRoute ? 'w-full h-full' : ''}>
            {children}
          </div>
        </main>
        
        {/* Mobile Navigation - Hidden on desktop and dashboard home (has its own nav) */}
        {!isDashboardHome && <MobileNav />}
      </div>
    </div>
  )
}
