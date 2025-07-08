"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { stateToLGAs } from "@/lib/data/lgas"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  studentId: z.string().regex(/^UG\d{2}\/[A-Z]{2}[A-Z]{2}\/\d{4}$/, {
    message: "Format must be like UG20/SCCS/1026",
  }),
  phone: z.string().min(10),
  state: z.string().min(2),
  localGovt: z.string().min(2),
  address: z.string().min(5),
  religion: z.string(),
  gender: z.string(),
  dob: z.date({ required_error: "Select your date of birth." }),
  level: z.string().min(1, 'Level is required'),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", studentId: "", phone: "", state: "",
      localGovt: "", address: "", religion: "", gender: "",
      dob: undefined, password: "", confirmPassword: ""
    }
  })

  const selectedState = form.watch("state")
  const lgas = selectedState ? stateToLGAs[selectedState.toLowerCase()] || [] : []

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dob: values.dob.toISOString(), // Ensure DOB is in correct format
          level: values.level,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.field) {
          form.setError(data.field, { message: data.error });
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: data.error || "Registration failed.",
          });
        }
        return;
      }

      toast({
        title: "Registration successful",
        description: "Welcome! Redirecting...",
      })

   router.push(
  data?.user?.role === "admin"
    ? "/dashboard/admin"
    : data?.user?.role === "dean"
    ? "/dashboard/dean"
    : "/dashboard"

)
// Can later be dynamic based on role
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message || "An error occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 border border-zinc-200 dark:border-zinc-800 mt-8 mb-8 mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3 mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground text-center">Join Connectrix to access clubs, resources, and more.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} autoComplete="name" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} autoComplete="email" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} autoComplete="tel" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="studentId" render={({ field }) => (
              <FormItem><FormLabel>Student ID</FormLabel><FormControl><Input {...field} autoComplete="off" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>State</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl><SelectContent>{Object.keys(stateToLGAs).map((state) => (<SelectItem key={state} value={state}>{state.toUpperCase()}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="localGovt" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>LGA</FormLabel><Select onValueChange={field.onChange} disabled={!selectedState}><FormControl><SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger></FormControl><SelectContent>{lgas.map((lga) => (<SelectItem key={lga} value={lga}>{lga}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} autoComplete="street-address" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <FormField control={form.control} name="religion" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Religion</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Religion" /></SelectTrigger></FormControl><SelectContent><SelectItem value="islam">Islam</SelectItem><SelectItem value="christianity">Christianity</SelectItem><SelectItem value="traditional">Traditional</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Gender</FormLabel><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 mt-2"><div className="flex items-center gap-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div></RadioGroup><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="dob" render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="yyyy-MM-dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={new Date("1950-01-01")}
                    placeholderText="Pick a date"
                    className="w-full border rounded px-3 py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2">
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} autoComplete="new-password" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} autoComplete="new-password" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="level" render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                    <SelectItem value="400">400</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="600">600</SelectItem>
                    <SelectItem value="700">700</SelectItem>
                    <SelectItem value="800">800</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full rounded-full font-semibold text-base py-3 mt-2" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Already have an account? <Link href="/login" className="underline text-primary">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
