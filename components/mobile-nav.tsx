"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, 
  Users, 
  Settings,
  Menu,
  User,
  Plus,
  Bell
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile vs desktop
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  // Get navigation items based on user role
  const getNavItems = () => {
    const isClub = user?.role === "club"
    const baseRoute = isClub ? "/dashboard/club" : "/dashboard"

    // For students, show 5 items with notifications
    if (!isClub) {
      return {
        firstTwo: [
          {
            href: baseRoute,
            icon: Home,
            label: "Home",
            active: pathname === baseRoute
          },
          {
            href: "/dashboard/clubs",
            icon: Users,
            label: "Clubs",
            active: isActive("/dashboard/clubs")
          }
        ],
        lastTwo: [
          {
            href: "/dashboard/notifications",
            icon: Bell,
            label: "Alerts",
            active: isActive("/dashboard/notifications")
          },
          {
            href: "/dashboard/profile",
            icon: User,
            label: "Profile",
            active: isActive("/dashboard/profile")
          }
        ]
      }
    }

    // For clubs, show 4 items
    return {
      firstTwo: [
        {
          href: baseRoute,
          icon: Home,
          label: "Home",
          active: pathname === baseRoute
        },
        {
          href: "/dashboard/club/members",
          icon: Users,
          label: "Members",
          active: isActive("/dashboard/club/members")
        }
      ],
      lastTwo: [
        {
          href: "/dashboard/club/profile",
          icon: User,
          label: "Profile",
          active: isActive("/dashboard/club/profile")
        },
        {
          href: "/dashboard/club/settings",
          icon: Settings,
          label: "Settings",
          active: isActive("/dashboard/club/settings")
        }
      ]
    }
  }

  const navItems = getNavItems()

  const CreatePostButton = () => {
    const handlePlusClick = () => {
      if (isMobile) {
        // On mobile, navigate to compose page
        router.push('/dashboard/compose')
      }
    }

    return (
      <div onClick={handlePlusClick} className="flex flex-col items-center justify-center text-xs flex-1 py-2 cursor-pointer transition-colors text-primary">
        <div className="mb-1 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
          <Plus className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        {/* First two nav items */}
        {navItems.firstTwo.map((item) => (
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
        
        {/* Central Add Post Button */}
        <CreatePostButton />

        {/* Last two nav items */}
        {navItems.lastTwo.map((item) => (
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
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
