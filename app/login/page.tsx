"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

// Schema for admin/club login (existing)
const adminFormSchema = z.object({
  userId: z.string()
    .min(2, 'Email or Student ID is required')
    .max(100, 'Input too long')
    .refine((val) => {
      // Check if it's a valid email or student ID format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const studentIdRegex = /^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/i;
      return emailRegex.test(val) || studentIdRegex.test(val);
    }, {
      message: 'Enter a valid email address or Student ID (e.g., UG20/SCCS/1026)'
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
})

// Schema for student login (new)
const studentFormSchema = z.object({
  name: z.string()
    .min(2, 'Full name is required')
    .max(100, 'Name too long')
    .trim(),
  studentId: z.string()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number too long')
    .refine((val) => {
      const regex = /^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/i;
      return regex.test(val);
    }, {
      message: 'Registration number must follow format UGYY/FFDD/NNNN (e.g., UG20/SCCS/1026)'
    })
})

// Faculty and department maps for preview
const FACULTY_MAP: Record<string, string> = {
  AS: "Arts and Social Sciences",
  ED: "Education", 
  LL: "Law",
  MD: "Medicine",
  PH: "Pharmacy",
  SC: "Science",
}

const DEPARTMENT_MAP: Record<string, string> = {
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
}

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, getRedirectPath } = useAuth()

  // Form for admin/club login
  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      userId: '',
      password: ''
    }
  })

  // Form for student login
  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      studentId: ''
    }
  })

  // Parse faculty and department from student ID for preview
  const parseStudentId = (studentId: string) => {
    const match = studentId.toUpperCase().match(/^UG\d{2}\/([A-Z]{2})([A-Z]{2})\/\d{4}$/)
    if (!match) return null
    
    const facultyCode = match[1]
    const departmentCode = match[2]
    return {
      faculty: FACULTY_MAP[facultyCode] || facultyCode,
      department: DEPARTMENT_MAP[departmentCode] || departmentCode
    }
  }

  // Watch student ID for preview
  const watchedStudentId = studentForm.watch('studentId')
  const preview = parseStudentId(watchedStudentId || '')

// Admin/Club login handler (existing logic)
const onAdminSubmit = async (values: z.infer<typeof adminFormSchema>) => {
  setIsLoading(true)
  try {
    await login(values.userId, values.password)
    
    toast({ 
      title: 'Login Successful!', 
      description: 'Welcome back!' 
    })
    
    // Navigate after AuthProvider state has been updated
    const redirectPath = getRedirectPath()
    router.push(redirectPath)
  } catch (err: any) {
    console.error('Login error:', err);
    
    // Handle different types of errors from the enhanced AuthProvider
    if (err.details && Array.isArray(err.details)) {
      // Handle Zod validation errors
      err.details.forEach((error: any) => {
        if (error.path && error.path.length > 0) {
          adminForm.setError(error.path[0], { message: error.message });
        }
      });
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please check your input and try again.',
      });
    } else if (err.field) {
      // Handle specific field errors
      adminForm.setError(err.field, { message: err.message });
    } else {
      // Handle general errors
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: err.message || 'Invalid credentials. Please try again.',
      })
    }
  } finally {
    setIsLoading(false)
  }
}

// Student login handler (new)
const onStudentSubmit = async (values: z.infer<typeof studentFormSchema>) => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/auth/login-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(values),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.details && Array.isArray(data.details)) {
        // Handle Zod validation errors
        data.details.forEach((error: any) => {
          if (error.path && error.path.length > 0) {
            studentForm.setError(error.path[0], { message: error.message });
          }
        });
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please check your input and try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data.error || 'Student login failed. Please try again.',
        })
      }
      return
    }

    toast({ 
      title: 'Login Successful!', 
      description: 'Welcome to Connectrix!' 
    })

    // Refresh the page to update auth state and redirect
    window.location.href = '/dashboard'
  } catch (err: any) {
    console.error('Student login error:', err)
    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description: 'An error occurred. Please try again.',
    })
  } finally {
    setIsLoading(false)
  }
}
  return (
    <div className="container flex flex-col min-h-screen justify-center items-center px-4">
      <Link href="/" className="absolute left-4 top-4">
        <Button variant="ghost">Back</Button>
      </Link>
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="admin">Admin/Club</TabsTrigger>
          </TabsList>
          
          {/* Student Login Tab */}
          <TabsContent value="student" className="space-y-4">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                <FormField control={studentForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={studentForm.control} name="studentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g., UG20/SCCS/1026"
                        onChange={(e) => {
                          field.onChange(e)
                          // Clear any preview errors when typing
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {/* Faculty/Department Preview */}
                {preview && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    <p><strong>Faculty:</strong> {preview.faculty}</p>
                    <p><strong>Department:</strong> {preview.department}</p>
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Admin/Club Login Tab */}
          <TabsContent value="admin" className="space-y-4">
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                <FormField control={adminForm.control} name="userId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Student ID</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={adminForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
            
            {/* Forgot Password Link - Only in Admin/Club tab */}
            <p className="text-sm text-center mt-2">
              <Link href="/forgot-password" className="underline text-primary">Forgot Password?</Link>
            </p>
          </TabsContent>
        </Tabs>
        
        <p className="text-sm text-center">
          Don't have an account? <Link href="/register" className="underline">Register</Link>
        </p>
      </div>
    </div>
  )
}