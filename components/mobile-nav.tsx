"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
      <Link
        href="/dashboard"
        className={cn(
          "flex flex-col items-center justify-center text-xs",
          isActive("/dashboard") &&
            !isActive("/dashboard/clubs") &&
            !isActive("/dashboard/resources") &&
            !isActive("/dashboard/campus-map") &&
            !isActive("/dashboard/events") &&
            !isActive("/dashboard/notifications") &&
            !isActive("/dashboard/settings")
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        <Home className="mb-1 h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link
        href="/dashboard/clubs"
        className={cn(
          "flex flex-col items-center justify-center text-xs",
          isActive("/dashboard/clubs") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Users className="mb-1 h-5 w-5" />
        <span>Clubs</span>
      </Link>
      <Link
        href="/dashboard/events"
        className={cn(
          "flex flex-col items-center justify-center text-xs",
          isActive("/dashboard/events") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Calendar className="mb-1 h-5 w-5" />
        <span>Events</span>
      </Link>
      <Link
        href="/dashboard/notifications"
        className={cn(
          "flex flex-col items-center justify-center text-xs",
          isActive("/dashboard/notifications") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Bell className="mb-1 h-5 w-5" />
        <span>Alerts</span>
      </Link>
      <Link
        href="/dashboard/settings"
        className={cn(
          "flex flex-col items-center justify-center text-xs",
          isActive("/dashboard/settings") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Settings className="mb-1 h-5 w-5" />
        <span>Settings</span>
      </Link>
    </div>
  )
}

