"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, Calendar, Users, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Mock data for elections
const mockActiveElections = [
  {
    id: "1",
    club: "Computer Science Club",
    position: "President",
    startDate: "2024-05-01",
    endDate: "2024-05-15",
    candidates: [
      { id: "c1", name: "John Doe", votes: 24 },
      { id: "c2", name: "Jane Smith", votes: 18 },
      { id: "c3", name: "Alex Johnson", votes: 12 },
    ],
    totalVotes: 54,
    hasVoted: false,
  },
  {
    id: "2",
    club: "Photography Society",
    position: "Treasurer",
    startDate: "2024-05-05",
    endDate: "2024-05-20",
    candidates: [
      { id: "c4", name: "Michael Brown", votes: 15 },
      { id: "c5", name: "Sarah Wilson", votes: 22 },
    ],
    totalVotes: 37,
    hasVoted: true,
  },
]

const mockPastElections = [
  {
    id: "3",
    club: "Debate Club",
    position: "Secretary",
    startDate: "2024-03-10",
    endDate: "2024-03-25",
    candidates: [
      { id: "c6", name: "David Lee", votes: 31, winner: true },
      { id: "c7", name: "Emily Chen", votes: 28 },
    ],
    totalVotes: 59,
    hasVoted: true,
  },
  {
    id: "4",
    club: "Environmental Society",
    position: "Vice President",
    startDate: "2024-02-15",
    endDate: "2024-03-01",
    candidates: [
      { id: "c8", name: "James Wilson", votes: 19 },
      { id: "c9", name: "Olivia Martinez", votes: 27, winner: true },
      { id: "c10", name: "Daniel Taylor", votes: 14 },
    ],
    totalVotes: 60,
    hasVoted: true,
  },
]

export default function ElectionsPage() {
  const { toast } = useToast()
  const [votingFor, setVotingFor] = useState<string | null>(null)
  const [activeElections, setActiveElections] = useState(mockActiveElections)

  const handleVote = async (electionId: string, candidateId: string, candidateName: string) => {
    setVotingFor(candidateId)

    try {
      // In a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the local state to reflect the vote
      setActiveElections((prev) =>
        prev.map((election) => {
          if (election.id === electionId) {
            return {
              ...election,
              hasVoted: true,
              candidates: election.candidates.map((candidate) => {
                if (candidate.id === candidateId) {
                  return { ...candidate, votes: candidate.votes + 1 }
                }
                return candidate
              }),
              totalVotes: election.totalVotes + 1,
            }
          }
          return election
        }),
      )

      toast({
        title: "Vote submitted",
        description: `You have successfully voted for ${candidateName}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Vote failed",
        description: "There was a problem submitting your vote. Please try again.",
      })
    } finally {
      setVotingFor(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Elections</h1>
        <p className="text-muted-foreground">Vote in club elections and view election results</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Elections</TabsTrigger>
          <TabsTrigger value="past">Past Elections</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeElections.length > 0 ? (
            <div className="grid gap-6">
              {activeElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{election.club}</CardTitle>
                        <CardDescription>{election.position} Election</CardDescription>
                      </div>
                      {election.hasVoted ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Voted
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          <Vote className="mr-1 h-3 w-3" />
                          Open
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(election.startDate).toLocaleDateString()} -{" "}
                          {new Date(election.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{election.totalVotes} votes cast</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Candidates</h4>
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((candidate.votes / (election.totalVotes || 1)) * 100)}% ({candidate.votes}{" "}
                              votes)
                            </span>
                          </div>
                          <Progress value={(candidate.votes / (election.totalVotes || 1)) * 100} className="h-2" />
                          {!election.hasVoted && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1 w-full"
                              onClick={() => handleVote(election.id, candidate.id, candidate.name)}
                              disabled={votingFor === candidate.id}
                            >
                              {votingFor === candidate.id ? "Submitting..." : "Vote"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/dashboard/elections/${election.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Elections</CardTitle>
                <CardDescription>There are no active elections at the moment.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-6">
            {mockPastElections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{election.club}</CardTitle>
                      <CardDescription>{election.position} Election</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(election.startDate).toLocaleDateString()} -{" "}
                        {new Date(election.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{election.totalVotes} votes cast</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Results</h4>
                    {election.candidates.map((candidate) => (
                      <div key={candidate.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {candidate.name}
                            {candidate.winner && (
                              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Winner
                              </Badge>
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((candidate.votes / (election.totalVotes || 1)) * 100)}% ({candidate.votes}{" "}
                            votes)
                          </span>
                        </div>
                        <Progress value={(candidate.votes / (election.totalVotes || 1)) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/elections/${election.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

