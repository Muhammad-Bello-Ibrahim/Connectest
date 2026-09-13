"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState("")
  function search(event: FormEvent) {
    event.preventDefault()
    if (query.trim()) router.push(`/dashboard?search=${encodeURIComponent(query.trim())}`)
  }
  return <header className="sticky top-0 z-40 -mx-4 mb-5 border-b bg-background/95 px-4 backdrop-blur md:mx-0 md:rounded-b-xl">
    <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 sm:gap-4">
      <Link href="/dashboard" className="hidden text-lg font-extrabold tracking-tight text-primary sm:block">connectrix.</Link>
      <form onSubmit={search} role="search" className="relative flex-1 sm:ml-4 sm:max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search campus posts" placeholder="Search campus posts" value={query} onChange={e => setQuery(e.target.value)} className="rounded-xl pl-9" />
      </form>
      <Button asChild variant="ghost" size="icon" aria-label="Notifications"><Link href="/dashboard/notifications"><Bell className="h-5 w-5" /></Link></Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Open profile menu"><Avatar className="h-9 w-9"><AvatarImage src={user?.avatar || ""} /><AvatarFallback>{user?.name?.slice(0, 1) || <User className="h-4 w-4" />}</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel><span className="block truncate">{user?.name}</span><span className="block truncate text-xs font-normal text-muted-foreground">{user?.email}</span></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
          {user?.role === "student" && <><DropdownMenuItem asChild><Link href="/dashboard/vendor">Vendor hub</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/dashboard/receipts">My receipts</Link></DropdownMenuItem></>}
          <DropdownMenuItem asChild><Link href={user?.role === "club" ? "/dashboard/club/settings" : "/dashboard/settings"}><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
          <DropdownMenuSeparator /><DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
}
