"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, User } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name?: string
  email?: string
  studentId?: string
  faculty?: string
  department?: string
  role?: string
  phone?: string
  gender?: string
  address?: string
  state?: string
  localGovt?: string
  dob?: string
  bio?: string
}

export default function ProfileCompletionBanner() {
  const [user, setUser] = useState<User | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if banner was already dismissed in this session
    const dismissed = sessionStorage.getItem("profile-banner-dismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include"
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          
          // Calculate profile completeness
          const completenessScore = calculateCompleteness(userData)
          
          // Show banner if completeness is less than 80%
          if (completenessScore < 80) {
            setIsVisible(true)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  const calculateCompleteness = (userData: User): number => {
    if (!userData) return 0

    const fields = [
      'name',
      'email', 
      'studentId',
      'phone',
      'gender', 
      'address',
      'state',
      'localGovt',
      'dob',
      'bio'
    ]

    const filledFields = fields.filter(field => {
      const value = userData[field as keyof User]
      return value && value.toString().trim() !== ''
    })

    return Math.round((filledFields.length / fields.length) * 100)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Remember dismissal for this session
    sessionStorage.setItem("profile-banner-dismissed", "true")
  }

  if (!isVisible || isDismissed || !user) {
    return null
  }

  const completenessScore = calculateCompleteness(user)

  return (
    <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Complete your profile ({completenessScore}%)
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Add more details to get better club recommendations and connect with peers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings">
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800">
                Complete Profile
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
