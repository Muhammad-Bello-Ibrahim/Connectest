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
  AlertCircle,
  Database,
  Server,
  Shield,
  CreditCard,
  Activity,
  FileText,
  HardDrive,
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
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin")}>
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
                <span>User Management</span>
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
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/database")}>
              <Link href="/dashboard/admin/database">
                <Database className="h-4 w-4" />
                <span>Database</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/system")}>
              <Link href="/dashboard/admin/system">
                <Server className="h-4 w-4" />
                <span>System</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/backups")}>
              <Link href="/dashboard/admin/backups">
                <HardDrive className="h-4 w-4" />
                <span>Backups</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/payments")}>
              <Link href="/dashboard/admin/payments">
                <CreditCard className="h-4 w-4" />
                <span>Payment Gateway</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/logs")}>
              <Link href="/dashboard/admin/logs">
                <Activity className="h-4 w-4" />
                <span>System Logs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/alerts")}>
              <Link href="/dashboard/admin/alerts">
                <AlertCircle className="h-4 w-4" />
                <span>Alerts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/admin/reports")}>
              <Link href="/dashboard/admin/reports">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
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

