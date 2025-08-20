"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProfileCompleteness {
  percent: number
  missing: string[]
}

interface ProfileData {
  user: Record<string, unknown>
  completeness: ProfileCompleteness
}

export function ProfileCompletionBanner() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  // Don't show banner if loading, dismissed, data not available, or profile is complete enough
  if (isLoading || 
      isDismissed || 
      !profileData || 
      profileData.completeness.percent >= 80) {
    return null
  }

  const missingFieldsText = profileData.completeness.missing
    .map(field => {
      // Convert field names to user-friendly labels
      const fieldLabels: Record<string, string> = {
        name: 'Full Name',
        studentId: 'Student ID',
        email: 'Email Address',
        state: 'State',
        religion: 'Religion',
        avatar: 'Profile Picture',
        address: 'Address',
        phone: 'Phone Number',
        gender: 'Gender',
        localGovt: 'Local Government'
      }
      return fieldLabels[field] || field
    })
    .slice(0, 3) // Show only first 3 missing fields
    .join(', ')

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <span className="font-medium text-orange-800 dark:text-orange-200">
            Your profile is {profileData.completeness.percent}% complete.
          </span>
          <span className="text-orange-700 dark:text-orange-300 ml-1">
            Missing: {missingFieldsText}
            {profileData.completeness.missing.length > 3 && ` and ${profileData.completeness.missing.length - 3} more`}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Link href="/dashboard/settings">
              Update now
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}