"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Filter } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { MobileNav } from "@/components/mobile-nav"

// Faculty and Department type definitions
type FacultyCode = "AS" | "ED" | "LL" | "MD" | "PH" | "SC"
type DepartmentCode = 
  | "AC" | "AR" | "BA" | "BF" | "CR" | "EC" | "ECE" | "EM" | "EN" | "HS" | "IN" | "IR" | "LS" | "PA" | "PC" | "PS" | "PSE" | "SG"  // AS
  | "BE" | "CE" | "CS" | "CSE" | "EC" | "EM" | "GE" | "GL" | "GS" | "IE" | "LE" | "ME" | "PE" | "RE"  // ED
  | "BL"  // LL
  | "HA" | "HN" | "HP" | "MD" | "NS" | "PC" | "PH" | "PHT" | "PM"  // MD
  | "PH"  // PH
  | "BC" | "BH" | "BS" | "BT" | "CH" | "CS" | "ET" | "GL" | "GS" | "MC" | "MT" | "NS" | "PV" | "PY" | "SL" | "ST" | "ZO"  // SC

interface Club {
  id: string
  name: string
  description: string
  members: number
  category: string
  status: "active" | "pending"
  type: "faculty" | "department" | "state" | "religion" | "general"
  faculty?: FacultyCode
  department?: DepartmentCode
  state?: string
  religion?: string
  isUserMember?: boolean
}

// Faculty information with full names
const facultyInfo = {
  AS: { name: "Arts and Social Sciences", departments: ["AC", "AR", "BA", "BF", "CR", "EC", "ECE", "EM", "EN", "HS", "IN", "IR", "LS", "PA", "PC", "PS", "PSE", "SG"] },
  ED: { name: "Education", departments: ["BE", "CE", "CS", "CSE", "EC", "EM", "GE", "GL", "GS", "IE", "LE", "ME", "PE", "RE"] },
  LL: { name: "Law", departments: ["BL"] },
  MD: { name: "Medicine", departments: ["HA", "HN", "HP", "MD", "NS", "PC", "PH", "PHT", "PM"] },
  PH: { name: "Pharmacy", departments: ["PH"] },
  SC: { name: "Science", departments: ["BC", "BH", "BS", "BT", "CH", "CS", "ET", "GL", "GS", "MC", "MT", "NS", "PV", "PY", "SL", "ST", "ZO"] }
}

// Department full names mapping
const departmentNames: Record<DepartmentCode, string> = {
  AC: "Accounting", AR: "Architecture", BA: "Business Administration", BF: "Banking and Finance",
  CR: "Criminology", EC: "Economics", ECE: "Economic Education", EM: "Educational Management",
  EN: "English", HS: "History", IN: "International Relations", IR: "Islamic Studies",
  LS: "Library and Information Science", PA: "Public Administration", PC: "Peace Studies and Conflict Resolution",
  PS: "Political Science", PSE: "Political Science Education", SG: "Sociology", BE: "Biology Education",
  CE: "Chemistry Education", CS: "Computer Science", CSE: "Computer Science Education", GE: "Geography Education",
  GL: "Geology", GS: "Geography", IE: "Islamic Education", LE: "English Education", ME: "Mathematics Education",
  PE: "Physical Education", RE: "Religious Education", BL: "Law", HA: "Human Anatomy", HN: "Human Nutrition and Dietetics",
  HP: "Human Physiology", MD: "Medicine", NS: "Nursing", PH: "Pharm D.", PHT: "Public Health", PM: "Pharmacology",
  BC: "Biochemistry", BH: "Biotechnology", BS: "Biology", BT: "Botany", CH: "Chemistry", ET: "Environmental Technology",
  MC: "Microbiology", MT: "Mathematics", PV: "Physics", PY: "Pure and Applied Physics", SL: "Science Laboratory Technology",
  ST: "Statistics", ZO: "Zoology"
}

// Helper functions
const getFacultyName = (code: FacultyCode): string => facultyInfo[code].name
const getDepartmentName = (code: DepartmentCode): string => departmentNames[code]

// Generate department clubs for a faculty (except Education)
const generateDepartmentClubs = (facultyCode: FacultyCode): Club[] => {
  if (facultyCode === "ED") return []; // Skip Education faculty departments
  
  return facultyInfo[facultyCode].departments.map(dept => ({
    id: `${facultyCode.toLowerCase()}-${dept.toLowerCase()}-dept`,
    name: `${getDepartmentName(dept as DepartmentCode)} Students Association`,
    description: `Official association for ${getDepartmentName(dept as DepartmentCode)} students`,
    members: Math.floor(Math.random() * 500) + 100, // Random member count between 100-600
    category: "Academic",
    status: "active",
    type: "department",
    faculty: facultyCode,
    department: dept as DepartmentCode
  }))
}

// Generate faculty association clubs
const generateFacultyClubs = (): Club[] => {
  return Object.keys(facultyInfo).map(facultyCode => ({
    id: `${facultyCode.toLowerCase()}-faculty-assoc`,
    name: `${getFacultyName(facultyCode as FacultyCode)} Students Association`,
    description: `Official association for all ${getFacultyName(facultyCode as FacultyCode)} students`,
    members: Math.floor(Math.random() * 2000) + 1000, // Random member count between 1000-3000
    category: "Academic",
    status: "active",
    type: "faculty",
    faculty: facultyCode as FacultyCode
  }))
}

// Special clubs for Education Faculty (as requested)
const educationFacultyClubs: Club[] = [
  {
    id: "ed-faculty-esan",
    name: "ESAN",
    description: "Official page for Education Students Association of Nigeria (ESAN)",
    members: 3807,
    category: "Academic",
    status: "active",
    type: "faculty",
    // faculty: "ED"
  },
  {
    id: "ed-art-ed-club",
    name: "Arts Education Students Club",
    description: "For students studying Arts Education programs",
    members: 650,
    category: "Academic",
    status: "active",
    type: "department",
    faculty: "ED",
    department: "LE" // Using LE (English Education) as representative
  },
  {
    id: "ed-science-ed-club",
    name: "Science Education Students Club",
    description: "For students studying Science Education programs",
    members: 850,
    category: "Academic",
    status: "active",
    type: "department",
    faculty: "ED",
    department: "BE" // Using BE (Biology Education) as representative
  }
]

// Generate all department clubs (except Education)
const allDepartmentClubs = [
  ...generateDepartmentClubs("AS"),
  ...generateDepartmentClubs("LL"),
  ...generateDepartmentClubs("MD"),
  ...generateDepartmentClubs("PH"),
  ...generateDepartmentClubs("SC")
]

// Generate all faculty clubs
const allFacultyClubs = generateFacultyClubs()

// Other special clubs
const specialClubs: Club[] = [
  {
    id: "src-general",
    name: "Student Representative Council (SRC)",
    description: "The official student government body representing all students.",
    members: 1248,
    category: "General",
    status: "active",
    type: "general",
  },
  {
    id: "gossa-state-assoc",
    name: "Gombe State Students Association (GOSSA)",
    description: "Association for students from Gombe State.",
    members: 85,
    category: "State",
    status: "active",
    type: "state",
    state: "Gombe",
  },
  {
    id: "mssn-religion-assoc",
    name: "Muslim Students Society of Nigeria (MSSN)",
    description: "Association for Muslim students.",
    members: 320,
    category: "Religion",
    status: "active",
    type: "religion",
    religion: "Islam",
  },
  {
    id: "gdg-tech-club",
    name: "Google Developer Group on Campus",
    description: "For students passionate about tech.",
    members: 28,
    category: "Hobby",
    status: "active",
    type: "general",
  },
  {
    id: "debate-club",
    name: "Creative Club",
    description: "Enhancing public speaking and critical thinking skills through debates.",
    members: 35,
    category: "hobby",
    status: "active",
    type: "general",
  },
  {
    id: "gamji-cultural-club",
    name: "Gamji Memorial Club",
    description: "Gombe state traditional ruling club on campus.",
    members: 31,
    category: "service",
    status: "active",
    type: "general",
  },
  {
    id: "drama-club",
    name: "Drama Club",
    description: "For students interested in theater and performing arts.",
    members: 24,
    category: "hobby",
    status: "pending",
    type: "general",
  }
]

// Combine all clubs
const allClubs = [
  ...allFacultyClubs,
  ...allDepartmentClubs,
  ...educationFacultyClubs,
  ...specialClubs
]

export default function ClubsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [userClubs, setUserClubs] = useState<Club[]>([])

  useEffect(() => {
    if (user && user.clubs) {
      const userClubIds = user.clubs
      const markedClubs = allClubs.map(club => ({
        ...club,
        isUserMember: userClubIds.includes(club.id),
      }))
      setUserClubs(markedClubs.filter(club => club.isUserMember))
    }
  }, [user])

  const filteredClubs = allClubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "my-clubs") return matchesSearch && (user?.clubs?.includes(club.id) || false)
    if (activeTab === "pending") return matchesSearch && club.status === "pending"
    if (activeTab === "faculty") return matchesSearch && club.type === "faculty"
    if (activeTab === "department") return matchesSearch && club.type === "department"
    if (activeTab === "state") return matchesSearch && club.type === "state"
    if (activeTab === "religion") return matchesSearch && club.type === "religion"
    if (activeTab === "general") return matchesSearch && club.type === "general"

    return matchesSearch && club.category === activeTab
  })

  const renderFacultyDeptInfo = (club: Club) => {
    if (club.type === "faculty" && club.faculty) {
      return `${club.faculty} - ${getFacultyName(club.faculty)}`
    }
    if (club.type === "department" && club.faculty && club.department) {
      return `${club.faculty}/${club.department} - ${getDepartmentName(club.department)}`
    }
    return club.type.charAt(0).toUpperCase() + club.type.slice(1)
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">Browse and join clubs or create your own</p>
        </div>
        <Link href="/dashboard/clubs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Club
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Clubs</TabsTrigger>
          <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="religion">Religion</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => (
              <Card key={club.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{club.name}</CardTitle>
                    {club.status === "pending" && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      >
                        Pending
                      </Badge>
                    )}
                    {club.isUserMember && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Member
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {club.members} members
                  </div>
                  <div className="mt-2 space-x-1">
                    <Badge variant="secondary">
                      {club.category}
                    </Badge>
                    <Badge variant="secondary">
                      {renderFacultyDeptInfo(club)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {club.status === "active" ? (club.isUserMember ? "View Details" : "Join Club") : "View Status"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredClubs.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No clubs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === "my-clubs"
                    ? "You haven't joined any clubs yet."
                    : "No clubs match your current search criteria."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}