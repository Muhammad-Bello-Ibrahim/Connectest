"use client"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "student" | "admin" | "dean"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  getRedirectPath: () => string
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  getRedirectPath: () => "/login",
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          credentials: "include",
        })
        if (res.ok) {
          const user = await res.json()
          setUser(user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth verification failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    verifyAuth()
  }, [])

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: identifier, password }),
      })

      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      const user = {
        ...data.user,
        id: data.user._id || data.user.id,
      }

      setUser(user)
      localStorage.setItem("connectrix-user", JSON.stringify(user))
    } catch (err) {
      console.error("Login error", err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      localStorage.removeItem("connectrix-user")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getRedirectPath = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "admin":
        return "/dashboard/admin"
      case "dean":
        return "/dashboard/dean"
      default:
        return "/dashboard"
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  )
}
