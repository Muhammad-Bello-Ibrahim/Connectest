import { Skeleton } from "@/components/ui/skeleton"
import { StatCardSkeleton, PageHeaderSkeleton, GridSkeleton } from "@/components/ui/skeleton-components"

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeaderSkeleton />
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="rounded-lg border p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="grid gap-4">
            <GridSkeleton columns={1} items={4} />
          </div>
        </div>
      </div>
    </div>
  )
}

