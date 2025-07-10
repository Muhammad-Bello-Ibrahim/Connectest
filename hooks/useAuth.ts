import { useContext } from "react"
import { AuthContext } from "@/components/auth-provider"

/**
 * Hook to access authentication context
 * @returns AuthContext with user, isLoading, login, logout, getRedirectPath, and isAuthenticated
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

/**
 * Hook to check if user is authenticated (has both user data and valid cookie)
 * @returns boolean indicating if user is authenticated
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated()
}