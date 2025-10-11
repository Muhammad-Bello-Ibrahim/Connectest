"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className = "", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
  rows?: number
}

export function LoadingCard({ className = "", rows = 3 }: LoadingCardProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-muted rounded w-full mb-1"></div>
      ))}
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center w-full">
      <LoadingSpinner size="lg" text={message} />
    </div>
  )
}
