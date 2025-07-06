"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Placeholder Calendar component to avoid breaking imports
export function Calendar() {
  return <div>Calendar component is not available. Please use react-datepicker or another picker.</div>;
}

export type CalendarProps = React.ComponentProps<typeof Calendar>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div
      className={cn("p-3", className)}
    >
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
        <div className="space-y-4">
          <div className="flex justify-center pt-1 relative items-center">
            <div className="text-sm font-medium"></div>
            <div className="space-x-1 flex items-center">
              <button
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="w-full border-collapse space-y-1">
            <div className="flex">
              <div className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"></div>
            </div>
            <div className="flex w-full mt-2">
              <div className="h-9 w-9 text-center text-sm p-0 relative"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
