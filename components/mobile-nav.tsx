"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Users, 
  Settings,
  Menu,
  User,
  Plus
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
import { toast } from "@/components/ui/use-toast"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
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
        // Refresh if on home page
        if (pathname === "/dashboard" || pathname === "/dashboard/club") {
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

  // Get navigation items based on user role
  const getNavItems = () => {
    const isClub = user?.role === "club"
    const baseRoute = isClub ? "/dashboard/club" : "/dashboard"
    
    return [
      {
        href: baseRoute,
        icon: Home,
        label: "Home",
        active: pathname === baseRoute
      },
      {
        href: isClub ? "/dashboard/club/members" : "/dashboard/clubs", 
        icon: Users,
        label: isClub ? "Members" : "Clubs",
        active: isActive(isClub ? "/dashboard/club/members" : "/dashboard/clubs")
      },
      {
        href: isClub ? "/dashboard/club/profile" : "/dashboard/profile",
        icon: User, 
        label: "Profile",
        active: isActive(isClub ? "/dashboard/club/profile" : "/dashboard/profile")
      },
      {
        href: isClub ? "/dashboard/club/settings" : "/dashboard/settings",
        icon: Settings,
        label: "Settings",
        active: isActive(isClub ? "/dashboard/club/settings" : "/dashboard/settings")
      }
    ]
  }

  const navItems = getNavItems()

  // Secondary navigation items (sheet menu) - Empty for now since we're simplifying
  const secondaryNavItems: any[] = []

  const CreatePostDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
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
  )

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        {/* First two nav items */}
        {navItems.slice(0, 2).map((item) => (
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
        <CreatePostDialog>
          <div className="flex flex-col items-center justify-center text-xs flex-1 py-2 cursor-pointer transition-colors text-primary">
            <div className="mb-1 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium">Add Post</span>
          </div>
        </CreatePostDialog>
        
        {/* Last two nav items */}
        {navItems.slice(2, 4).map((item) => (
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
        
        {/* Menu Button - Hide if no secondary items */}
        {secondaryNavItems.length > 0 && (
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
        )}
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}

