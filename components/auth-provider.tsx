"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type User = {
  _id: string
  role: "admin" | "student" | "club"
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 🔹 Utility: get redirect path by role
  const getRedirectPath = (role?: string) => {
    switch (role) {
      case "admin":
        return "/dashboard/admin"
      case "club":
        return "/dashboard/club"
      default:
        return "/dashboard"
    }
  }

  // ✅ LOGIN FUNCTION (fixed redirect delay)
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Save user locally
      setUser(data.user)
      localStorage.setItem("connectrix-user", JSON.stringify(data.user))

      toast.success("Login successful")

      // 🔸 FIX 1: Delay redirect to ensure React state updates
      const redirectPath = getRedirectPath(data.user.role)
      setTimeout(() => {
        router.replace(redirectPath)
      }, 100)
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ LOGOUT FUNCTION
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("connectrix-user")
      setUser(null)
      router.replace("/login")
    }
  }

  // ✅ Verify authentication (persistent login fix)
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const cachedUser = localStorage.getItem("connectrix-user")
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser))
          } catch {
            localStorage.removeItem("connectrix-user")
          }
        }

        // 🔸 FIX 2: Always verify via API (HttpOnly cookies can’t be read client-side)
        const res = await fetch("/api/auth/verify", {
          credentials: "include"
        })

        if (res.ok) {
          const verifiedUser = await res.json()
          setUser(verifiedUser)
          localStorage.setItem("connectrix-user", JSON.stringify(verifiedUser))
        } else if (res.status === 401) {
          // Attempt refresh token
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include"
          })

          if (refreshRes.ok) {
            const newUser = await refreshRes.json()
            setUser(newUser)
            localStorage.setItem("connectrix-user", JSON.stringify(newUser))
          } else {
            setUser(null)
            localStorage.removeItem("connectrix-user")
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error)
        setUser(null)
        localStorage.removeItem("connectrix-user")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const isAuthenticated = () => !!user

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
