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
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  email: z.string()
    .min(1, 'Email or Student ID is required')
    .max(100, 'Email or Student ID too long')
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
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

// Update your onSubmit function to use AuthProvider's login method
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  setIsLoading(true)
  try {
    await login(values.email, values.password)

    // AuthProvider handles the redirect automatically
    // No need to manually redirect here
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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/studentBgi.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10"></div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome Back to<br />Connectrix
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Your campus community awaits. Connect with clubs, join events, and stay updated with everything happening on campus.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-white/80">Active Clubs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-white/80">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-white/80">Events</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-white/60 text-sm">
          © 2025 Connectrix. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email or Student ID</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        className="h-11 pl-10 transition-all focus:ring-2 focus:ring-primary/20" 
                        placeholder="Enter your email or student ID"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        {...field} 
                        className="h-11 pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20" 
                        placeholder="Enter your password"
                      />
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">New to Connectrix?</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
