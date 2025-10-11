"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"

interface NetworkError {
  message: string
  status?: number
  isNetworkError?: boolean
}

export function useNetworkError() {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleError = (error: NetworkError, retryFn?: () => void) => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "No Internet Connection",
        description: "Please check your internet connection and try again.",
        action: retryFn ? (
          <button
            onClick={retryFn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        ) : undefined,
      })
      return
    }

    if (error.status === 401) {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please log in again to continue.",
      })
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
      return
    }

    if (error.status === 403) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
      })
      return
    }

    if (error.status === 429) {
      toast({
        variant: "destructive",
        title: "Too Many Requests",
        description: "Please wait a moment before trying again.",
      })
      return
    }

    if (error.status >= 500) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
        action: retryFn ? (
          <button
            onClick={retryFn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        ) : undefined,
      })
      return
    }

    // Network or other errors
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "An unexpected error occurred.",
      action: retryFn ? (
        <button
          onClick={retryFn}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      ) : undefined,
    })
  }

  const NetworkStatusIndicator = () => (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline
          ? "bg-green-500/20 border border-green-500 text-green-700"
          : "bg-red-500/20 border border-red-500 text-red-700"
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  )

  return {
    isOnline,
    handleError,
    retryCount,
    NetworkStatusIndicator,
  }
}

/**
 * Enhanced fetch wrapper with network error handling and retry logic
 */
export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit = {},
  retryOptions: {
    maxRetries?: number
    retryDelay?: number
    onRetry?: (attempt: number) => void
  } = {}
) {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = retryOptions

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
      })

      // If response is not ok, throw error with status
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          isNetworkError: false,
        } as NetworkError
      }

      return response
    } catch (error: any) {
      lastError = error

      // Check if it's a network error (no internet)
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        error = {
          message: "Network error - please check your internet connection",
          status: 0,
          isNetworkError: true,
        } as NetworkError
      }

      // Don't retry on client errors (4xx) or if it's the last attempt
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error
      }

      if (attempt < maxRetries) {
        onRetry?.(attempt + 1)
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }
  }

  throw lastError
}
