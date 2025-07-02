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
  userId: z.string().min(2, { message: 'Email or Student ID is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
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
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')

    toast({ title: 'Login successful', description: 'Redirecting...' })
    
    // Use window.location to ensure full page reload and auth state sync
    window.location.href = getRedirectPath(data.user.role)
  } catch (err: any) {
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: err.message || 'Invalid credentials',
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
              {isLoading ? 'Logging in...' : 'Login'}
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