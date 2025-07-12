import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ClubSettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded"></div>
      </div>

      <div className="grid gap-6">
        {/* Settings Cards */}
        {[...Array(4)].map((_, cardIndex) => (
          <Card key={cardIndex} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-48"></div>
                    </div>
                    <div className="h-6 w-11 bg-muted rounded-full"></div>
                  </div>
                  {itemIndex < 4 && <div className="h-px bg-muted mt-4"></div>}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}