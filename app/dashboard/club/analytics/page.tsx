"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  BarChart,
  PieChart,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function DeanAnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState("thisMonth")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for campus clubs</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={activePeriod} onValueChange={setActivePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.5%</span> from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+3</span> new clubs this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Held</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+15%</span> from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">-2%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Club Activity Overview</CardTitle>
                <CardDescription>Monthly activity across all clubs</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Line chart showing club activity over time)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Club Membership Distribution</CardTitle>
                <CardDescription>Percentage of students in each club type</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Pie chart showing distribution)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
                <CardDescription>Number of events held by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Bar chart showing events by category)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Clubs</CardTitle>
              <CardDescription>Based on membership, activity, and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Computer Science Club</span>
                      <Badge variant="outline">Academic</Badge>
                    </div>
                    <span>92 points</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Photography Society</span>
                      <Badge variant="outline">Cultural</Badge>
                    </div>
                    <span>88 points</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Debate Club</span>
                      <Badge variant="outline">Academic</Badge>
                    </div>
                    <span>85 points</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Environmental Society</span>
                      <Badge variant="outline">Service</Badge>
                    </div>
                    <span>82 points</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Nigerian Association of Science Students</span>
                      <Badge variant="outline">Faculty</Badge>
                    </div>
                    <span>78 points</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Membership Growth</CardTitle>
                <CardDescription>Change in club membership over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Line chart showing membership growth trends)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership by Faculty</CardTitle>
                <CardDescription>Distribution of club members across faculties</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Pie chart showing faculty distribution)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Membership Statistics by Club Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Academic Clubs</span>
                    <span>1,245 members</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cultural Clubs</span>
                    <span>865 members</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Service Clubs</span>
                    <span>542 members</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sports Clubs</span>
                    <span>654 members</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Faculty Associations</span>
                    <span>1,850 members</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Attendance Trends</CardTitle>
                <CardDescription>Average attendance percentage over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Line chart showing attendance trends)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events by Day of Week</CardTitle>
                <CardDescription>Distribution of events across weekdays</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Bar chart showing events by day of week)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Events by Category and Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Academic Workshops</span>
                      <Badge variant="outline">28 events</Badge>
                    </div>
                    <span>78% avg. attendance</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Social Gatherings</span>
                      <Badge variant="outline">15 events</Badge>
                    </div>
                    <span>82% avg. attendance</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Competitions</span>
                      <Badge variant="outline">12 events</Badge>
                    </div>
                    <span>68% avg. attendance</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Cultural Performances</span>
                      <Badge variant="outline">8 events</Badge>
                    </div>
                    <span>85% avg. attendance</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Community Service</span>
                      <Badge variant="outline">5 events</Badge>
                    </div>
                    <span>72% avg. attendance</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Score</CardTitle>
                <CardDescription>Average engagement scores over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Line chart showing engagement trends)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement by Student Year Level</CardTitle>
                <CardDescription>Engagement scores across different years</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Bar chart showing engagement by year level)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Key engagement indicators across all clubs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-medium">Meeting Attendance</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">74%</div>
                    <p className="text-xs text-muted-foreground">Average across all clubs</p>
                  </div>
                  <Progress value={74} className="mt-2 h-2" />
                </div>
                <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <h3 className="font-medium">Member Retention</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">86%</div>
                    <p className="text-xs text-muted-foreground">Semester-to-semester retention</p>
                  </div>
                  <Progress value={86} className="mt-2 h-2" />
                </div>
                <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-medium">Active Participation</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">62%</div>
                    <p className="text-xs text-muted-foreground">Members who participate regularly</p>
                  </div>
                  <Progress value={62} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Gender breakdown of club membership</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Pie chart showing gender distribution)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Members by Faculty</CardTitle>
                <CardDescription>Distribution across university faculties</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                    <p className="text-sm">(Bar chart showing faculty distribution)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>State of Origin Distribution</CardTitle>
              <CardDescription>Top 5 states represented in club membership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Lagos</span>
                    <span>568 students</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Abuja (FCT)</span>
                    <span>432 students</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rivers</span>
                    <span>324 students</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Kano</span>
                    <span>289 students</span>
                  </div>
                  <Progress value={43} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Enugu</span>
                    <span>256 students</span>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

