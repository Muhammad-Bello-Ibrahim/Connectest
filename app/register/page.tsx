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
  // You can map these codes to real names if you have a map
  const facultyMap: Record<string, string> = { SC: "Science", EN: "Engineering" }
  const deptMap: Record<string, string> = { CS: "Computer Science", EE: "Electrical Engineering" }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-800">
        {/* Progress Bar (green) */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Only show active category as heading */}
        <h2 className="text-lg font-semibold text-center mb-2 text-foreground">
          {stages[stage]}
        </h2>
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
        <div className="text-center text-sm">
          Already have an account? <Link href="/login" className="underline text-primary">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
