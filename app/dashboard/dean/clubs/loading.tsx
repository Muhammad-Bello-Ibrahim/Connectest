import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton-components"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeaderSkeleton />
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      {/* Clubs Table */}
      <TableSkeleton rows={8} />
    </div>
  )
}

