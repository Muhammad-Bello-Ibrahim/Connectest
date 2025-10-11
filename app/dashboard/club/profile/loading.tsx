import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ClubProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="md:col-span-2 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-muted rounded-full"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-28 mb-2"></div>
            <div className="h-4 bg-muted rounded w-40"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Club Statistics */}
        <Card className="md:col-span-2 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-56"></div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="space-y-1">
                    <div className="h-6 bg-muted rounded w-12"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
