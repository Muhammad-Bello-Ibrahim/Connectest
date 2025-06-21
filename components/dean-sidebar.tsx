"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Vote,
  Settings,
  LogOut,
  Bell,
  FileText,
  BarChart,
  CheckCircle,
  Building,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DeanSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/dashboard/dean" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Dean Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean")}>
              <Link href="/dashboard/dean">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/clubs")}>
              <Link href="/dashboard/dean/clubs">
                <Users className="h-4 w-4" />
                <span>Club Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/events")}>
              <Link href="/dashboard/dean/events">
                <Calendar className="h-4 w-4" />
                <span>Event Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/elections")}>
              <Link href="/dashboard/dean/elections">
                <Vote className="h-4 w-4" />
                <span>Elections</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/reports")}>
              <Link href="/dashboard/dean/reports">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/analytics")}>
              <Link href="/dashboard/dean/analytics">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/approvals")}>
              <Link href="/dashboard/dean/approvals">
                <CheckCircle className="h-4 w-4" />
                <span>Pending Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/facilities")}>
              <Link href="/dashboard/dean/facilities">
                <Building className="h-4 w-4" />
                <span>Facility Allocation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/announcements")}>
              <Link href="/dashboard/dean/announcements">
                <Bell className="h-4 w-4" />
                <span>Announcements</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/dean/settings")}>
              <Link href="/dashboard/dean/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start hover:bg-primary/10" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

