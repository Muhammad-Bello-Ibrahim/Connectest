import { Skeleton } from "@/components/ui/skeleton"

// Card skeleton for general content cards
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

// Dashboard stats skeleton
export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5" />
      </div>
      <Skeleton className="h-8 w-16 mt-2" />
      <Skeleton className="h-3 w-32 mt-1" />
    </div>
  )
}

// Table skeleton for data tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border">
      {/* Table header */}
      <div className="border-b p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b p-4 last:border-b-0">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// List item skeleton for club listings, event listings, etc.
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

// Page header skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

// Grid skeleton for dashboard cards
export function GridSkeleton({ columns = 3, items = 6 }: { columns?: number, items?: number }) {
  return (
    <div className={`grid gap-6 ${
      columns === 2 ? 'md:grid-cols-2' : 
      columns === 3 ? 'md:grid-cols-3' : 
      columns === 4 ? 'md:grid-cols-4' : 
      'md:grid-cols-3'
    }`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}