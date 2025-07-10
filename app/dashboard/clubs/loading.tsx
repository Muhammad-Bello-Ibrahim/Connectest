import { PageHeaderSkeleton, GridSkeleton } from "@/components/ui/skeleton-components"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeaderSkeleton />
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      {/* Clubs Grid */}
      <GridSkeleton columns={3} items={9} />
      
      {/* Pagination */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}

