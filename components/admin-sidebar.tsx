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
  Settings,
  LogOut,
  Shield,
  User,
  Building2,
  BarChart3,
  Database,
  CreditCard,
  FileText,
  AlertTriangle,
  ChevronDown,
  Calendar,
  Mail,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/dashboard/admin" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Admin Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin") && pathname === "/dashboard/admin"}>
              <Link href="/dashboard/admin">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/users")}>
              <Link href="/dashboard/admin/users">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/clubs")}>
              <Link href="/dashboard/admin/clubs">
                <Building2 className="h-4 w-4" />
                <span>Clubs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/events")}>
              <Link href="/dashboard/admin/events">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/bulk-operations")}>
              <Link href="/dashboard/admin/bulk-operations">
                <Users className="h-4 w-4" />
                <span>Bulk Operations</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/campaigns")}>
              <Link href="/dashboard/admin/campaigns">
                <Mail className="h-4 w-4" />
                <span>Campaigns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/analytics")}>
              <Link href="/dashboard/admin/analytics">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/logs/audit")}>
              <Link href="/dashboard/admin/logs/audit">
                <FileText className="h-4 w-4" />
                <span>Audit Logs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/logs/errors")}>
              <Link href="/dashboard/admin/logs/errors">
                <AlertTriangle className="h-4 w-4" />
                <span>Error Logs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/payments")}>
              <Link href="/dashboard/admin/payments">
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/database")}>
              <Link href="/dashboard/admin/database">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/security")}>
              <Link href="/dashboard/admin/security">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/settings")}>
              <Link href="/dashboard/admin/settings">
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

