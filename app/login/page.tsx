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
import { useAuth } from '@/hooks/use-auth'
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
  const { login, getRedirectPath } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      password: ''
    }
  })

// Update your onSubmit function to use AuthProvider's login method
const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
          form.setError(error.path[0], { message: error.message });
        }
      });
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please check your input and try again.',
      });
    } else if (err.field) {
      // Handle specific field errors
      form.setError(err.field, { message: err.message });
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