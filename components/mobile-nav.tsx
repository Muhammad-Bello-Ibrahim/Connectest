"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, BookOpen, MapPin, Plus } from "lucide-react"
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
          "flex flex-col items-center justify-center text-xs flex-1",
          isActive("/dashboard") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Home className="mb-1 h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link
        href="/dashboard/clubs"
        className={cn(
          "flex flex-col items-center justify-center text-xs flex-1",
          isActive("/dashboard/clubs") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <Users className="mb-1 h-5 w-5" />
        <span>Clubs</span>
      </Link>
      {/* Plus Icon in Center */}
      <Link
        href="/dashboard/create-post"
        className={cn(
          "flex flex-col items-center justify-center flex-1",
        )}
      >
        <span className="flex items-center justify-center bg-primary text-white rounded-full w-12 h-12 -mt-8 shadow-lg border-4 border-background">
          <Plus className="h-7 w-7" />
        </span>
      </Link>
      <Link
        href="/dashboard/resources"
        className={cn(
          "flex flex-col items-center justify-center text-xs flex-1",
          isActive("/dashboard/resources") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <BookOpen className="mb-1 h-5 w-5" />
        <span>Resources</span>
      </Link>
      <Link
        href="/dashboard/campus-map"
        className={cn(
          "flex flex-col items-center justify-center text-xs flex-1",
          isActive("/dashboard/campus-map") ? "text-primary" : "text-muted-foreground",
        )}
      >
        <MapPin className="mb-1 h-5 w-5" />
        <span>Map</span>
      </Link>
    </div>
  )
}

