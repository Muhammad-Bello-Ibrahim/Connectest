"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Users, 
  BookOpen, 
  MapPin, 
  Plus, 
  Vote, 
  Calendar,
  Bell,
  CreditCard,
  Settings,
  Menu
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  // Primary navigation items (bottom nav)
  const primaryNavItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      active: pathname === "/dashboard"
    },
    {
      href: "/dashboard/clubs", 
      icon: Users,
      label: "Clubs",
      active: isActive("/dashboard/clubs")
    },
    {
      href: "/dashboard/resources",
      icon: BookOpen, 
      label: "Resources",
      active: isActive("/dashboard/resources")
    },
    {
      href: "/dashboard/campus-map",
      icon: MapPin,
      label: "Map", 
      active: isActive("/dashboard/campus-map")
    }
  ]

  // Secondary navigation items (sheet menu)
  const secondaryNavItems = [
    {
      href: "/dashboard/elections",
      icon: Vote,
      label: "Elections",
      active: isActive("/dashboard/elections")
    },
    {
      href: "/dashboard/events",
      icon: Calendar,
      label: "Events", 
      active: isActive("/dashboard/events")
    },
    {
      href: "/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
      active: isActive("/dashboard/notifications")
    },
    {
      href: "/dashboard/payments",
      icon: CreditCard,
      label: "Payments",
      active: isActive("/dashboard/payments")
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      active: isActive("/dashboard/settings")
    }
  ]

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        {primaryNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center text-xs flex-1 py-2 transition-colors",
              item.active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="mb-1 h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        
        {/* Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center text-xs flex-1 py-2 h-auto"
            >
              <Menu className="mb-1 h-5 w-5" />
              <span className="text-[10px] font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[60vh]">
            <div className="grid gap-4 py-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">More Options</h3>
                <p className="text-sm text-muted-foreground">Quick access to all features</p>
              </div>
              <div className="grid gap-2">
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
                      item.active 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              {user && (
                <div className="border-t pt-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Signed in as <span className="font-medium">{user.name}</span>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}

