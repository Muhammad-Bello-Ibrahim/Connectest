import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ClubDashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-64"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-40 mb-2"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                  </div>
                ))}
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom card skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-2 bg-muted rounded mt-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}