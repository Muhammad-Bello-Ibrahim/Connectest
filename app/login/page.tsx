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
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

const formSchema = z.object({
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

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      password: ''
    }
  })

 // Add this function to your login page component
const getRedirectPath = (role: string) => {
  switch(role) {
    case 'admin': return '/dashboard/admin'
    case 'dean': return '/dashboard/dean'
    default: return '/dashboard' // student
  }
}

// Update your onSubmit function
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  setIsLoading(true)
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'include', // Important for cookies
    })

    const data = await res.json()
    if (!res.ok) {
      // Handle validation errors from server
      if (data.details && Array.isArray(data.details)) {
        // Handle Zod validation errors
        data.details.forEach((error: any) => {
          if (error.path && error.path.length > 0) {
            form.setError(error.path[0], { message: error.message });
          }
        });
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please check your input and try again.',
        });
      } else if (data.field) {
        // Handle specific field errors
        form.setError(data.field, { message: data.error });
      } else {
        // Handle general errors
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data.error || 'Invalid credentials. Please try again.',
        });
      }
      return;
    }

    toast({ 
      title: 'Login Successful!', 
      description: `Welcome back, ${data.user?.name || 'User'}!` 
    })
    
    // Use Next.js router for proper navigation
    const redirectPath = getRedirectPath(data.user.role)
    router.push(redirectPath)
  } catch (err: any) {
    console.error('Login error:', err);
    toast({
      variant: 'destructive',
      title: 'Network Error',
      description: 'Unable to connect to server. Please check your internet connection.',
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Student ID</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
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
        <p className="text-sm text-center">
          Don't have an account? <Link href="/register" className="underline">Register</Link>
        </p>
        <p className="text-sm text-center mt-2">
          <Link href="/forgot-password" className="underline text-primary">Forgot Password?</Link>
        </p>
      </div>
    </div>
  )
}