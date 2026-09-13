"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Map, BookOpen, Plus, ShoppingBag, Settings, ShieldCheck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const student = [
    { href: "/dashboard", label: "Feed", icon: Home },
    { href: "/dashboard/clubs", label: "Clubs", icon: Users },
    { href: "/dashboard/map", label: "Map", icon: Map },
    { href: "/dashboard/resources", label: "Resources", icon: BookOpen },
    { href: "/dashboard/compose", label: "Add Post", icon: Plus },
    { href: "/dashboard/marketplace", label: "Market", icon: ShoppingBag },
  ]
  const club = [
    { href: "/dashboard/club", label: "Club", icon: Home },
    { href: "/dashboard/club/members", label: "Members", icon: Users },
    { href: "/dashboard/club/dues", label: "Dues", icon: ShieldCheck },
    { href: "/dashboard/club/settings", label: "Settings", icon: Settings },
  ]
  const admin = [
    { href: "/dashboard/admin", label: "Admin", icon: Home },
    { href: "/dashboard/admin/clubs", label: "Clubs", icon: Users },
    { href: "/dashboard/admin/vendors", label: "Vendors", icon: ShoppingBag },
    { href: "/dashboard/admin/campus", label: "Campus", icon: Map },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ]
  const items = user?.role === "club" ? club : user?.role === "admin" ? admin : student
  return <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 grid border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
    {items.map(item => {
      const active = item.href === "/dashboard" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")
      return <Link key={item.href} href={item.href} aria-label={item.label === "Market" ? "Marketplace" : item.label === "Clubs" ? "Clubs and organizations" : item.label === "Map" ? "Campus Map" : item.label} aria-current={active ? "page" : undefined}
        className={cn("flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[9px] font-semibold text-muted-foreground", active && "text-primary") }>
        <item.icon className="h-5 w-5" /><span className="truncate max-w-full">{item.label}</span>
      </Link>
    })}
  </nav>
}
