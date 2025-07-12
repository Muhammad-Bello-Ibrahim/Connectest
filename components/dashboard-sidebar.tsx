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
import { LayoutDashboard, Users, Settings, LogOut, User, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both title and content"
      })
      return
    }

    try {
      setIsCreatingPost(true)
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newPostTitle.trim(),
          content: newPostContent.trim(),
          isPublic: true
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Your post has been created"
        })
        setNewPostTitle("")
        setNewPostContent("")
        setIsDialogOpen(false)
        // Refresh the page if we're on the dashboard to show new post
        if (pathname === "/dashboard") {
          window.location.reload()
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to create post"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error while creating post"
      })
    } finally {
      setIsCreatingPost(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary">Connectrix</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/clubs")}>
              <Link href="/dashboard/clubs">
                <Users className="h-4 w-4" />
                <span>Clubs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Central Add Post Button */}
          <SidebarMenuItem>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  <span>Add Post</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share something with your community
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostTitle.trim() || !newPostContent.trim() || isCreatingPost}
                    >
                      {isCreatingPost ? "Posting..." : "Create Post"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/profile")}>
              <Link href="/dashboard/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
              <Link href="/dashboard/settings">
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

