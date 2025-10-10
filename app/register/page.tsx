"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"



const stages = [
  "Student Information",
  "Account Security"
]

// Helper: Extract faculty/department from studentId
function extractFacultyDept(studentId: string) {
  // Example: UG20/SCCS/1026
  const match = studentId.match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d{4}$/)
  if (!match) return { faculty: "", department: "" }
  
  const facultyMap: Record<string, string> = {
    AS: "Arts and Social Sciences",
    ED: "Education",
    LL: "Law",
    MD: "Medicine",
    PH: "Pharmacy",
    SC: "Science"
  }
  
  const deptMap: Record<string, string> = {
    AC: "Accounting",
    AR: "Architecture",
    BA: "Business Administration",
    BF: "Banking and Finance",
    CR: "Criminology",
    EC: "Economics",
    ECE: "Economic Education",
    EM: "Educational Management",
    EN: "English",
    HS: "History",
    IN: "International Relations",
    IR: "Islamic Studies",
    LS: "Library and Information Science",
    PA: "Public Administration",
    PC: "Peace Studies and Conflict Resolution",
    PS: "Political Science",
    PSE: "Political Science Education",
    SG: "Sociology",
    BL: "Law",
    HA: "Human Anatomy",
    HN: "Human Nutrition and Dietetics",
    HP: "Human Physiology",
    MD: "Medicine",
    NS: "Nursing",
    PH: "Pharm D.",
    PHT: "Public Health",
    PM: "Pharmacology",
    BC: "Biochemistry",
    BH: "Biotechnology",
    BS: "Biology",
    BT: "Botany",
    CH: "Chemistry",
    CS: "Computer Science",
    ET: "Environmental Technology",
    GL: "Geology",
    GS: "Geography",
    MC: "Microbiology",
    MT: "Mathematics",
    PV: "Physics",
    PY: "Pure and Applied Physics",
    SL: "Science Laboratory Technology",
    ST: "Statistics",
    ZO: "Zoology"
  }
  
  return {
    faculty: facultyMap[match[1]] || match[1],
    department: deptMap[match[2]] || match[2]
  }
}

const formSchema = z.object({
  name: z.string().min(2).max(100),
  studentId: z.string()
    .regex(/^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/, { message: "Student ID format must be like UG20/SCCS/1026" }),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  password: z.string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", studentId: "", faculty: "", department: "", password: "", confirmPassword: ""
    }
  })

  // Watch studentId and auto-populate faculty/department
  const studentId = form.watch("studentId")
  useEffect(() => {
    if (studentId && /^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/.test(studentId)) {
      const { faculty, department } = extractFacultyDept(studentId)
      form.setValue("faculty", faculty)
      form.setValue("department", department)
    } else {
      form.setValue("faculty", "")
      form.setValue("department", "")
    }
    // eslint-disable-next-line
  }, [studentId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          studentId: values.studentId,
          faculty: values.faculty,
          department: values.department,
          password: values.password
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((error: any) => {
            if (error.path && error.path.length > 0) {
              form.setError(error.path[0], { message: error.message });
            }
          });
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please check the form for errors and try again.",
          });
        } else if (data.field) {
          form.setError(data.field, { message: data.error });
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: data.error || "An error occurred during registration.",
          });
        }
        return;
      }
      toast({
        title: "Registration Successful!",
        description: `Welcome to Connectrix! You've been matched with ${data.user?.clubsMatched || 0} clubs.`,
      })
      setTimeout(() => {
        router.push(
          data?.user?.role === "admin"
            ? "/dashboard/admin"
            : data?.user?.role === "dean"
            ? "/dashboard/dean"
            : "/dashboard"
        )
      }, 1500);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Unable to connect to server. Please check your internet connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Progress bar (green)
  const progress = ((stage + 1) / stages.length) * 100
  // Per-stage field names for validation
  const stageFields = [
    ["name", "studentId", "faculty", "department"],
    ["password", "confirmPassword"]
  ]

  // Validate only current stage fields
  const validateStage = async () => {
    const fields = stageFields[stage]
    let valid = true
    for (const field of fields) {
      const result = await form.trigger(field as any)
      if (!result) valid = false
    }
    return valid
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/studentBg.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Join Connectrix<br />Today
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Create your account and become part of the most vibrant campus community. Connect, engage, and grow.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Auto-join Clubs</div>
                <div className="text-white/80 text-sm">Automatically matched with clubs based on your profile</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Stay Updated</div>
                <div className="text-white/80 text-sm">Get real-time updates on events and activities</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold">Connect & Grow</div>
                <div className="text-white/80 text-sm">Network with peers and expand your horizons</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Connectrix. All rights reserved.
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-xl space-y-6 animate-fade-in my-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground">Step {stage + 1} of {stages.length}: {stages[stage]}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
            autoComplete="off"
          >


            {/* Step 1: Student Information */}
            {stage === 0 && (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} autoComplete="name" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="studentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="faculty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {/* Step 2: Account Security */}
            {stage === 1 && (
              <>
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setStage((s) => Math.max(s - 1, 0))} disabled={stage === 0}>
                Back
              </Button>
              {stage < stages.length - 1 ? (
                <Button
                  type="button"
                  className="font-semibold text-base py-3 bg-green-600 hover:bg-green-700 text-white"
                  onClick={async () => {
                    const valid = await validateStage()
                    if (valid) setStage((s) => Math.min(s + 1, stages.length - 1))
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="font-semibold text-base py-3 bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              )}
            </div>
          </form>
        </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
