"use client"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hasAuthToken, getCookie } from "@/lib/cookies"

type User = {
  id: string
  name: string
  email: string
  role: "student" | "admin" | "club"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  getRedirectPath: () => string
  isAuthenticated: () => boolean
  updateProfile: (data: any) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  getRedirectPath: () => "/login",
  isAuthenticated: () => false,
  updateProfile: async () => {},
})
  const updateProfile = async (data: any) => {
    const res = await fetch("/api/auth/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Profile update failed");
    setUser(result.user);
    localStorage.setItem("connectrix-user", JSON.stringify(result.user));
  };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check if auth token cookie exists
        if (!hasAuthToken()) {
          // No auth cookie, user is not logged in
          setUser(null)
          setIsLoading(false)
          return
        }

        // Check localStorage for cached user data first
        const cachedUser = localStorage.getItem("connectrix-user")
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser)
            setUser(parsedUser)
          } catch (error) {
            console.error("Failed to parse cached user data:", error)
            localStorage.removeItem("connectrix-user")
          }
        }

        // Verify with server even if we have cached data to ensure token is still valid
        const res = await fetch("/api/auth/verify", {
          credentials: "include",
        })
        
        if (res.ok) {
          const user = await res.json()
          setUser(user)
          // Update localStorage with fresh user data
          localStorage.setItem("connectrix-user", JSON.stringify(user))
        } else {
          // Token invalid or expired, clear everything
          setUser(null)
          localStorage.removeItem("connectrix-user")
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

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: identifier, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.error || "Login failed");
        (error as any).details = data.details;
        (error as any).field = data.field;
        (error as any).status = res.status;
        throw error;
      }

      const user = {
        ...data.user,
        id: data.user._id || data.user.id,
      };

      setUser(user);
      localStorage.setItem("connectrix-user", JSON.stringify(user));

      if (!hasAuthToken()) {
        console.warn("Warning: Auth token cookie was not set after login");
      }

      // Redirect after state update
      const redirectPath = getRedirectPath();
      router.push(redirectPath);
    } catch (err) {
      console.error("Login error", err);
      throw err;
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
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "club":
        return "/dashboard/club";
      case "student":
        return "/feed";
      default:
        return "/dashboard";
    }
  }

  const isAuthenticated = () => {
    return user !== null && hasAuthToken()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, getRedirectPath, isAuthenticated, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
