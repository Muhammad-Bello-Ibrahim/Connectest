"use client"

import type React from "react"
import { createContext, useEffect, useState } from "react"

// Define club types
type Club = {
  id: string
  name: string
  description: string
  type: "faculty" | "department" | "state" | "religion" | "general"
  faculty?: string
  department?: string
  state?: string
  religion?: string
}

type User = {
  id: string
  name: string
  email: string
  role: "student" | "admin" | "dean"
  studentId?: string
  level?: string
  faculty?: string
  department?: string
  phone?: string
  state?: string
  localGovt?: string
  address?: string
  religion?: string
  gender?: string
  dob?: string
  bio?: string
  avatar?: string
  clubs?: string[] // IDs of clubs the user belongs to
  darkMode?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (userId: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  getRedirectPath: () => string
  updateProfile: (profileData: Partial<User>) => Promise<void>
  toggleDarkMode: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  getRedirectPath: () => "/dashboard",
  updateProfile: async () => {},
  toggleDarkMode: () => {},
})

// Mapping faculties abbreviations to their full names
const facultyMap: Record<string, string> = {
  SC: "Science",
  AS: "Art and Social Science",
  ED: "Education",
  MD: "Medical Sciences",
  PH: "Pharmacy",
  LB: "Law",
}

// Mapping department abbreviations to their full names within each faculty
const departmentMap: Record<string, Record<string, string>> = {
  SC: {
    CS: "Computer Science",
    MT: "Mathematics",
    CH: "Chemistry",
    BE: "Biological Sciences",
    BT: "Botany/ Forestry",
    BC: "Biochemistry",
    GE: "Geography",
    GL: "Geology",
    MB: "Microbiology",
    PH: "Physics",
    SL: "Science Laboratory Technology",
  },
  AS: {
    AC: "Accounting",
    BA: "Business Administration",
    EC: "Economics",
    EN: "English Language",
    HI: "History",
    PS: "Political Science",
    PA: "Public Administration",
    SO: "Sociology",
    IR: "Islamic Religious Studies"
  },
  ED: {
    AS: "Arts and Social Science Education",
    EF: "Educational Foundations",
    SE: "Science Education",
    EP: "Educational Psychology",
  },
  PH: {
    CP: "Clinical Pharmacy and Pharmacy Practice",
    PD: "Pharmacognosy and Drug Development",
    PC: "Pharmaceutical and Medicinal Chemistry",
    PT: "Pharmacology and Toxicology",
    PP: "Pharmaceutics and Pharmaceutical Technology",
  },
  LB: {
    LB: "Law",
  },
  MD: {
    HA: "Human Anatomy",
    HP: "Human Physiology",
    MD: "Medicine and Surgery",
    ML: "Medical Laboratory Science",
  },
}

// List of all clubs
const allClubs: Club[] = [
  // General clubs (all students)
  {
    id: "src",
    name: "Student Representative Council (SRC)",
    description: "The official student government body representing all students.",
    type: "general",
  },

  // Faculty-based clubs
  {
    id: "nass",
    name: "Nigerian Association of Science Students (NASS)",
    description: "Association for all science students.",
    type: "faculty",
    faculty: "Science",
  },
  {
    id: "nacos",
    name: "Nigerian Association of Computing Students (NACOS)",
    description: "Association for computer science students.",
    type: "department",
    department: "Computer Science",
  },

  // State-based clubs
  {
    id: "gossa",
    name: "Gombe State Students Association (GOSSA)",
    description: "Association for students from Gombe State.",
    type: "state",
    state: "Gombe",
  },

  // Religion-based clubs
  {
    id: "mssn",
    name: "Muslim Students Society of Nigeria (MSSN)",
    description: "Association for Muslim students.",
    type: "religion",
    religion: "Islam",
  },
  {
    id: "cans",
    name: "Christian Association of Nigeria Students (CANS)",
    description: "Association for Muslim students.",
    type: "religion",
    religion: "Christianity",
  },
]

// Generate clubs for all faculties and departments
Object.entries(facultyMap).forEach(([code, facultyName]) => {
  // Add faculty club
  allClubs.push({
    id: `faculty-${code.toLowerCase()}`,
    name: `${facultyName} Students Association`,
    description: `Association for all students in the Faculty of ${facultyName}.`,
    type: "faculty",
    faculty: facultyName,
  })

  // Add department clubs for this faculty
  if (departmentMap[code]) {
    Object.entries(departmentMap[code]).forEach(([deptCode, deptName]) => {
      allClubs.push({
        id: `dept-${code.toLowerCase()}-${deptCode.toLowerCase()}`,
        name: `${deptName} Students Association`,
        description: `Association for students in the ${deptName} department.`,
        type: "department",
        faculty: facultyName,
        department: deptName,
      })
    })
  }
})

// Function to parse student ID and extract level, faculty, and department
function parseStudentId(studentId: string): { level: string; faculty: string; department: string } {
  // Default values in case parsing fails
  let level = "Unknown"
  let faculty = "Unknown"
  let department = "Unknown"

  try {
    if (studentId && studentId.length >= 10) {
      // Extract year from 3rd and 4th characters (e.g., "20" from "UG20/SCCS/1026")
      const yearStr = studentId.substring(2, 4)
      const year = Number.parseInt(yearStr, 10)

      // Calculate level based on year (assuming current year is 2025)
      const currentYear = 25 // Last two digits of 2025
      const yearDifference = currentYear - year

      if (yearDifference === 0) level = "100 Level"
      else if (yearDifference === 1) level = "200 Level"
      else if (yearDifference === 2) level = "300 Level"
      else if (yearDifference === 3) level = "400 Level"
      else if (yearDifference === 4) level = "500 Level"
      else if (yearDifference > 4) level = "Graduate"
      else level = "Unknown"

      // Extract faculty code (6th and 7th characters)
      const facultyCode = studentId.substring(5, 7)
      faculty = facultyMap[facultyCode] || "Unknown"

      // Extract department code (8th and 9th characters)
      const departmentCode = studentId.substring(7, 9)
      department = departmentMap[facultyCode]?.[departmentCode] || "Unknown"
    }
  } catch (error) {
    console.error("Error parsing student ID:", error)
  }

  return { level, faculty, department }
}

// Function to assign clubs to a user based on their details
function assignClubsToUser(userData: User): string[] {
  const userClubs: string[] = []

  // Add all students to SRC
  userClubs.push("src")

  // Faculty-based assignments
  if (userData.faculty === "Science") {
    userClubs.push("nass")
  }

  // Department-based assignments
  if (userData.department === "Computer Science") {
    userClubs.push("nacos")
  }

  // State-based assignments
  if (userData.state === "Gombe") {
    userClubs.push("gossa")
  }

  // Religion-based assignments
  if (userData.religion?.toLowerCase() === "islam") {
    userClubs.push("mssn")
  }

  // Add faculty-specific club
  const facultyClub = allClubs.find((club) => club.type === "faculty" && club.faculty === userData.faculty)
  if (facultyClub) {
    userClubs.push(facultyClub.id)
  }

  // Add department-specific club
  const departmentClub = allClubs.find((club) => club.type === "department" && club.department === userData.department)
  if (departmentClub) {
    userClubs.push(departmentClub.id)
  }

  return userClubs
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("connectrix-user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Apply dark mode if user has it enabled
      if (parsedUser.darkMode) {
        document.documentElement.classList.add("dark")
        setDarkMode(true)
      }
    }
    setIsLoading(false)
  }, [])

  const toggleDarkMode = () => {
    if (user) {
      const updatedUser = { ...user, darkMode: !user.darkMode }
      setUser(updatedUser)
      localStorage.setItem("connectrix-user", JSON.stringify(updatedUser))

      if (updatedUser.darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      setDarkMode(!darkMode)
    }
  }

  const getRedirectPath = () => {
    if (!user) return "/login"

    switch (user.role) {
      case "admin":
        return "/dashboard/admin"
      case "dean":
        return "/dashboard/dean"
      case "student":
      default:
        return "/dashboard"
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) return

    // Update user data
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem("connectrix-user", JSON.stringify(updatedUser))

    // In a real app, this would call your API to update the user profile
    return Promise.resolve()
  }

  const login = async (userId: string, password: string) => {
    // In a real app, this would call your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check for admin and dean credentials
    if (userId === "dean" && password === "12345678") {
      const deanUser: User = {
        id: "dean-1",
        name: "Dean of Student Affairs",
        email: "dean@gmail.com",
        role: "dean",
        avatar: "/placeholder.svg?height=128&width=128",
        bio: "Responsible for overseeing student activities and club approvals.",
        phone: "+234 800 123 4567",
        darkMode: false,
      }
      setUser(deanUser)
      localStorage.setItem("connectrix-user", JSON.stringify(deanUser))
      return
    }

    if (userId === "admin" && password === "12345678") {
      const adminUser: User = {
        id: "admin-1",
        name: "System Administrator",
        email: "admin@gmail.com",
        role: "admin",
        avatar: "/placeholder.svg?height=128&width=128",
        bio: "Manages the technical aspects of the Connectrix platform.",
        phone: "+234 800 765 4321",
        darkMode: false,
      }
      setUser(adminUser)
      localStorage.setItem("connectrix-user", JSON.stringify(adminUser))
      return
    }

    // Check if we have a stored user with this userId (for demo purposes)
    const storedUsers = localStorage.getItem("connectrix-users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    const foundUser = users.find((u: any) => u.studentId === userId || u.email === userId)

    if (foundUser && foundUser.password === password) {
      // Remove password from user object before storing in state
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("connectrix-user", JSON.stringify(userWithoutPassword))
      return
    }

    // If no user found or password doesn't match, create a mock student user
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "student@gmail.com",
      role: "student",
      studentId: "UG20/SCCS/1026",
      level: "400 Level",
      faculty: "Science",
      department: "Computer Science",
      phone: "+234 800 987 6543",
      state: "Lagos",
      localGovt: "Ikeja",
      address: "123 University Road, Ikeja",
      religion: "Christianity",
      gender: "Male",
      dob: new Date("2000-05-15").toISOString(),
      bio: "Computer Science student passionate about web development and AI.",
      avatar: "/placeholder.svg?height=128&width=128",
      clubs: ["src", "nass", "nacos"],
      darkMode: false,
    }

    setUser(mockUser)
    localStorage.setItem("connectrix-user", JSON.stringify(mockUser))
  }

  const register = async (userData: any) => {
    // In a real app, this would call your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Parse student ID to get level, faculty, and department
    const { level, faculty, department } = parseStudentId(userData.studentId)

    // Create user object
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: userData.fullName,
      email: userData.email,
      role: "student",
      studentId: userData.studentId,
      level,
      faculty,
      department,
      phone: userData.phone,
      state: userData.state,
      localGovt: userData.localGovt,
      address: userData.address,
      religion: userData.religion,
      gender: userData.gender,
      dob: userData.dob ? new Date(userData.dob).toISOString() : undefined,
      bio: "",
      avatar: "/placeholder.svg?height=128&width=128",
      darkMode: false,
    }

    // Assign clubs based on user details
    newUser.clubs = assignClubsToUser(newUser)

    // Store user in local storage (with password for demo login)
    const storedUsers = localStorage.getItem("connectrix-users")
    const users = storedUsers ? JSON.parse(storedUsers) : []
    users.push({ ...newUser, password: userData.password })
    localStorage.setItem("connectrix-users", JSON.stringify(users))

    // Set current user (without password)
    setUser(newUser)
    localStorage.setItem("connectrix-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("connectrix-user")
    document.documentElement.classList.remove("dark")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        getRedirectPath,
        updateProfile,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

