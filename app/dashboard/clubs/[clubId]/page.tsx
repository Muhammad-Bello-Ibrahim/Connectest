"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  UserMinus,
  Loader2,
  MapPin,
  Building2,
  GraduationCap,
  Globe,
  CreditCard,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { MobileNav } from "@/components/mobile-nav"

interface Executive {
  _id: string
  name: string
  role: string
  avatar?: string
  email?: string
}

interface Club {
  _id: string
  name: string
  description: string
  abbreviation?: string
  logo?: string
  type: string
  faculty?: {
    code: string
    name: string
  }
  department?: {
    code: string
    name: string
  }
  state?: string
  religion?: string
  members: number
  status: "active" | "pending"
  isUserMember?: boolean
  executives?: Executive[]
  duesApplied?: boolean
  duesAmount?: number
  hasPaidDues?: boolean
}

export default function ClubDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const clubId = params?.clubId as string

  const [club, setClub] = useState<Club | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isPayingDues, setIsPayingDues] = useState(false)

  useEffect(() => {
    if (clubId) {
      fetchClubDetails()
    }
  }, [clubId])

  const fetchClubDetails = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/clubs/${clubId}`, {
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setClub(data.club)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load club details",
        })
      }
    } catch (error) {
      console.error("Error fetching club:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinLeave = async () => {
    if (!club) return

    setIsJoining(true)
    try {
      const method = club.isUserMember ? "DELETE" : "POST"
      const res = await fetch(`/api/clubs/${club._id}/join`, {
        method,
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success!",
          description: data.message,
        })

        setClub((prev) =>
          prev
            ? {
                ...prev,
                isUserMember: !prev.isUserMember,
                members: prev.isUserMember
                  ? prev.members - 1
                  : prev.members + 1,
              }
            : null
        )
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Operation failed",
        })
      }
    } catch (error) {
      console.error("Failed to join/leave club:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error. Please try again.",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const isAutoJoined =
    club &&
    ["src", "faculty", "department", "state", "religion"].includes(club.type)

  const handlePayDues = async () => {
    if (!club) return

    setIsPayingDues(true)
    try {
      const res = await fetch(`/api/clubs/${club._id}/pay-dues`, {
        method: "POST",
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Payment Initiated!",
          description: data.message || "Redirecting to payment...",
        })

        // Update club state to reflect payment
        setClub((prev) =>
          prev
            ? {
                ...prev,
                hasPaidDues: true,
              }
            : null
        )

        // Redirect to payment page if provided
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to initiate payment",
        })
      }
    } catch (error) {
      console.error("Failed to pay dues:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Network error. Please try again.",
      })
    } finally {
      setIsPayingDues(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 md:pb-6 w-[90vw] mx-auto">
        <Card className="animate-pulse">
          <CardHeader className="p-4 sm:p-6">
            <div className="h-6 sm:h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 sm:h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="h-3 sm:h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 sm:h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
        <MobileNav />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen pb-20 md:pb-6 w-[90vw] mx-auto flex items-center justify-center">
        <Card className="text-center py-12 sm:py-16 w-full">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Club not found</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              The club you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-6 w-[90vw] mx-auto">
      {/* Club Header */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
            {/* Club Logo */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.name}
                  className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-border"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-2 sm:border-4 border-border">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                    {club.abbreviation?.[0] || club.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Club Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
                <div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">
                    {club.name}
                  </CardTitle>
                  {club.abbreviation && (
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {club.abbreviation}
                    </p>
                  )}
                </div>

                {/* Join/Leave Button - Only for general clubs */}
                {!isAutoJoined && club.status === "active" && (
                  <Button
                    variant={club.isUserMember ? "destructive" : "default"}
                    size="lg"
                    onClick={handleJoinLeave}
                    disabled={isJoining}
                    className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
                  >
                    {isJoining ? (
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : club.isUserMember ? (
                      <>
                        <UserMinus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Leave Club
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Join Club
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
                <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                  {club.type}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
                  <Users className="h-3 w-3" />
                  {club.members} members
                </Badge>
                {club.status === "pending" && (
                  <Badge variant="destructive" className="text-xs sm:text-sm">Pending Approval</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Club Bio/Description */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">About</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {club.description}
          </p>
        </CardContent>
      </Card>

      {/* Club Executives */}
      {club.executives && club.executives.length > 0 && (
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Club Executives</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {club.executives.map((exec) => (
                <div
                  key={exec._id}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  {/* Executive Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
                    {exec.avatar ? (
                      <img
                        src={exec.avatar}
                        alt={exec.name}
                        className="w-full h-full rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {exec.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Executive Info */}
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {exec.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {exec.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Club Information */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Club Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          {club.faculty && (
            <div className="flex items-start gap-2 sm:gap-3">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Faculty
                </p>
                <p className="text-sm sm:text-base break-words">
                  {typeof club.faculty === 'object' ? club.faculty.name : club.faculty}
                </p>
              </div>
            </div>
          )}

          {club.department && (
            <div className="flex items-start gap-2 sm:gap-3">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Department
                </p>
                <p className="text-sm sm:text-base break-words">
                  {typeof club.department === 'object' ? club.department.name : club.department}
                </p>
              </div>
            </div>
          )}

          {club.state && (
            <div className="flex items-start gap-2 sm:gap-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  State/LGA
                </p>
                <p className="text-sm sm:text-base break-words">{club.state}</p>
              </div>
            </div>
          )}

          {club.religion && (
            <div className="flex items-start gap-2 sm:gap-3">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Religion
                </p>
                <p className="text-sm sm:text-base break-words">{club.religion}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pay Dues Section - Only for auto-joined clubs with dues applied */}
      {isAutoJoined && club.duesApplied && !club.hasPaidDues && (
        <Card className="mt-4 sm:mt-6 border-primary/50 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  Club Dues Payment Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pay your club dues to maintain active membership
                </p>
              </div>
              <Button
                size="lg"
                onClick={handlePayDues}
                disabled={isPayingDues}
                className="w-full sm:w-auto gap-2"
              >
                {isPayingDues ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay Dues - ₦{club.duesAmount?.toLocaleString() || 0}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dues Paid Confirmation */}
      {isAutoJoined && club.duesApplied && club.hasPaidDues && (
        <Card className="mt-4 sm:mt-6 border-green-500/50 bg-green-500/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-green-700 dark:text-green-400">
                  Dues Paid
                </h3>
                <p className="text-sm text-muted-foreground">
                  You have successfully paid your club dues of ₦{club.duesAmount?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <MobileNav />
    </div>
  )
}
